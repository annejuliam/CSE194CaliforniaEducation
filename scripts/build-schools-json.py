#!/usr/bin/env python3
"""Join the CDE school directory to the metric CSVs.

    npm run build:schools

Inputs:
  data/raw/pubschls.xlsx
  data/csv/freeReducedLunch2526_FRPM_School-Level_Data.csv
  data/csv/censusEnrollment2526_School-Level.csv
  data/csv/dashboardEla2025_School-Level.csv
  data/csv/dashboardMath2025_School-Level.csv
  src/data/schools_sample.json   (graduation, only where the pilot has it)

Output:
  public/data/schools.json

Only Active schools with a real name and numeric lat/lon are included.
District-only rows and closed schools are left out.
"""

import csv
import json
import zipfile
from datetime import date
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIRECTORY = ROOT / "data/raw/pubschls.xlsx"
FRPM = ROOT / "data/csv/freeReducedLunch2526_FRPM_School-Level_Data.csv"
ENROLLMENT = ROOT / "data/csv/censusEnrollment2526_School-Level.csv"
ELA = ROOT / "data/csv/dashboardEla2025_School-Level.csv"
MATH = ROOT / "data/csv/dashboardMath2025_School-Level.csv"
PILOT = ROOT / "src/data/schools_sample.json"
OUTPUT = ROOT / "public/data/schools.json"

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def cds_from_parts(county, district, school):
    return f"{int(county):02d}{int(district):05d}{int(school):07d}"


def to_int(value):
    try:
        return int(str(value).strip())
    except (TypeError, ValueError):
        return None


def to_float(value):
    if value is None or str(value).strip() == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def load_csv_by_cds(path):
    with path.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        return {}
    county_key = next(key for key in rows[0] if "County Code" in key)
    by_cds = {}
    for row in rows:
        code = cds_from_parts(row[county_key], row["District Code"], row["School Code"])
        by_cds[code] = row
    return by_cds


def load_directory(path):
    """Read the CDE workbook with the stdlib. Header is the row that starts with CDSCode."""
    with zipfile.ZipFile(path) as workbook:
        shared_root = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
        strings = [
            "".join(node.text or "" for node in item.iter(f"{{{NS['m']}}}t"))
            for item in shared_root.findall("m:si", NS)
        ]
        sheet = ET.fromstring(workbook.read("xl/worksheets/sheet1.xml"))

    def column_index(cell_ref):
        letters = "".join(char for char in cell_ref if char.isalpha())
        index = 0
        for char in letters:
            index = index * 26 + ord(char) - 64
        return index - 1

    def cell_value(cell):
        value = cell.find("m:v", NS)
        if value is None or value.text is None:
            return ""
        if cell.attrib.get("t") == "s":
            return strings[int(value.text)]
        return value.text

    def row_values(row):
        values = {}
        for cell in row.findall("m:c", NS):
            values[column_index(cell.attrib.get("r", "A"))] = cell_value(cell)
        if not values:
            return []
        return [values.get(index, "") for index in range(max(values) + 1)]

    rows = sheet.findall("m:sheetData/m:row", NS)
    header = None
    records = []
    for row in rows:
        values = row_values(row)
        if header is None:
            if values and values[0] == "CDSCode":
                header = values
            continue
        record = {header[index]: values[index] if index < len(values) else "" for index in range(len(header))}
        records.append(record)
    return records


def main():
    directory = load_directory(DIRECTORY)
    frpm = load_csv_by_cds(FRPM)
    enrollment = load_csv_by_cds(ENROLLMENT)
    ela = load_csv_by_cds(ELA)
    math = load_csv_by_cds(MATH)
    pilot = {
        row["cds_code"]: row
        for row in json.loads(PILOT.read_text())
    }

    schools = []
    skipped_no_location = 0
    for row in directory:
        name = (row.get("School") or "").strip()
        if row.get("StatusType") != "Active" or name in ("", "No Data"):
            continue
        lat = to_float(row.get("Latitude"))
        lng = to_float(row.get("Longitude"))
        if lat is None or lng is None:
            skipped_no_location += 1
            continue

        code = str(row["CDSCode"]).zfill(14)
        meal = frpm.get(code, {})
        enrolled = enrollment.get(code, {})
        ela_row = ela.get(code, {})
        math_row = math.get(code, {})
        grad = pilot.get(code, {})

        schools.append({
            "id": code,
            "name": name,
            "detail": row.get("District") or "",
            "county": row.get("County") or "",
            "city": row.get("City") or "",
            "coords": [round(lng, 5), round(lat, 5)],
            "schoolType": row.get("SOCType") or None,
            "charter": row.get("Charter") or None,
            "academicYear": meal.get("Academic Year") or enrolled.get("Academic Year"),
            "enrollmentK12": to_int(meal.get("Enrollment  (K-12)")) or to_int(enrolled.get("Total Enrollment")),
            "frpmEligibleCount": to_int(meal.get("FRPM Count  (K-12)")),
            "frpmEligibleShare": to_float(meal.get("Percent (%)  Eligible FRPM  (K-12)")),
            "socioeconomicallyDisadvantaged": to_int(enrolled.get("Socioeconomically Disadvantaged")),
            "elaDistanceFromStandard": to_float(ela_row.get("Distance from Standard")),
            "elaStudentsTested": to_int(ela_row.get("Students Tested")),
            "elaDashboardColor": ela_row.get("Dashboard Color") or None,
            "mathDistanceFromStandard": to_float(math_row.get("Distance from Standard")),
            "mathStudentsTested": to_int(math_row.get("Students Tested")),
            "mathDashboardColor": math_row.get("Dashboard Color") or None,
            "gradCombinedShare": grad.get("grad_combined_share"),
            "gradCombinedCount": grad.get("grad_combined_count"),
            "gradCombinedCohort": grad.get("grad_combined_cohort"),
            "gradReportingYear": grad.get("grad_reporting_year"),
        })

    schools.sort(key=lambda school: (school["county"], school["name"], school["id"]))
    with_frpm = sum(school["frpmEligibleShare"] is not None for school in schools)

    output = {
        "meta": {
            "title": "California Public Schools: Does inequality shape education?",
            "description": "Active California public schools with CDE directory coordinates, joined to FRPM, enrollment, and Dashboard ELA/Math where those files have a matching CDS code.",
            "count": len(schools),
            "withFrpm": with_frpm,
            "skippedActiveWithoutCoordinates": skipped_no_location,
            "scope": "Active California schools with latitude and longitude. Closed schools and district-only rows are excluded.",
            "directoryFile": "data/raw/pubschls.xlsx",
            "directoryDate": "2026-11-22",
            "colorMetric": "frpmEligibleShare",
            "colorMetricLabel": "FRPM eligibility (K–12)",
            "updated": date.today().isoformat(),
        },
        "schools": schools,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(output) + "\n")
    print(f"Wrote {len(schools)} schools ({with_frpm} with FRPM) to {OUTPUT.relative_to(ROOT)}")
    print(f"Skipped {skipped_no_location} active schools with no coordinates")


if __name__ == "__main__":
    main()

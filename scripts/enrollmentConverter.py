import pandas as pd
from pathlib import Path

# Raw data folder will contain the Census Day enrollment files, and the output folder named csv will contain the converted CSV files
# Source: https://www.cde.ca.gov/ds/ad/filesenrcensus.asp (ex: cdenroll2526.txt saved as censusEnrollment2526.txt)
input_folder = Path("data/raw") #censusEnrollment txt files
output_folder = Path("data/csv")

output_folder.mkdir(parents=True, exist_ok=True)

# CDE category codes and the column names we want for them
categories = {
    "TA": "Total Enrollment",
    "RE_H": "Hispanic or Latino",
    "RE_W": "White",
    "RE_A": "Asian",
    "RE_B": "Black or African American",
    "RE_F": "Filipino",
    "RE_I": "American Indian or Alaska Native",
    "RE_P": "Pacific Islander",
    "RE_T": "Two or More Races",
    "RE_D": "Race Not Reported",
    "GN_F": "Female",
    "GN_M": "Male",
    "GN_X": "Non-Binary",
    "SG_SD": "Socioeconomically Disadvantaged",
}

race_columns = [
    name for code, name in categories.items()
    if code.startswith("RE_")
]
gender_columns = [
    name for code, name in categories.items()
    if code.startswith("GN_")
]

# Columns that identify a school, renamed to match the free/reduced lunch CSV
school_columns = {
    "AcademicYear": "Academic Year",
    "CountyCode": "County Code",
    "DistrictCode": "District Code",
    "SchoolCode": "School Code",
    "CountyName": "County Name",
    "DistrictName": "District Name",
    "SchoolName": "School Name",
    "Charter": "Charter",
}


# Convert every enrollment file in the raw folder
for file in input_folder.glob("censusEnrollment*.txt"):
    print(f"\nReading {file.name}...")

    # Read the tab separated file, it uses Windows encoding (for names like Cañada)
    df = pd.read_csv(
        file,
        sep="\t",
        dtype=str,
        encoding="cp1252"
    )

    # Remove completely empty rows and columns
    df = df.dropna(how="all")
    df = df.dropna(axis=1, how="all")

    # Keep only school rows (the file also has state, county, and district totals) and the categories we want
    df = df[
        (df["AggregateLevel"] == "S") &
        (df["ReportingCategory"].isin(categories))
    ]
    df["TOTAL_ENR"] = pd.to_numeric(df["TOTAL_ENR"])

    # Turn one row per school per category into one row per school with a column for each category
    # A school with no students in a category has no row for it, so it gets 0
    df = df.pivot_table(
        index=list(school_columns),
        columns="ReportingCategory",
        values="TOTAL_ENR",
        aggfunc="sum",
        fill_value=0
    )

    # Make column names easier to work with
    df = df.rename(columns=categories)[list(categories.values())]
    df = df.reset_index().rename(columns=school_columns)

    # Check that every student is counted in exactly one race and one gender
    assert (df[race_columns].sum(axis=1) == df["Total Enrollment"]).all(), "race counts don't add up"
    assert (df[gender_columns].sum(axis=1) == df["Total Enrollment"]).all(), "gender counts don't add up"

    output_path = output_folder / (
        f"{file.stem}_School-Level.csv"
    )

    df.to_csv(
        output_path,
        index=False,
        encoding="utf-8-sig"
    )

    print(f"Saved {len(df)} rows to {output_path}")

print("\nFinished converting files!")

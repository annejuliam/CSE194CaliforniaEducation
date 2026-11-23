# Data for the Explore Map

## Locations

`raw/pubschls.xlsx` is the CDE Public Schools and Districts file (November 22, 2026). It is the source of CDS codes, school names, and latitude/longitude.

The map includes **active** schools that have coordinates. Closed schools, district-only rows, and active schools with no lat/lon are left out.

## Metric CSVs

These files cover California but do not have coordinates. They are joined to the directory on the 14-digit CDS code.

| File | Contents |
|---|---|
| `csv/freeReducedLunch2526_FRPM_School-Level_Data.csv` | FRPM eligibility (economic-need proxy) |
| `csv/censusEnrollment2526_School-Level.csv` | Enrollment |
| `csv/dashboardEla2025_School-Level.csv` | Dashboard ELA Distance from Standard |
| `csv/dashboardMath2025_School-Level.csv` | Dashboard Math Distance from Standard |

`src/data/schools_sample.json` still supplies graduation rates for the 19 San Diego Unified pilot schools. Other schools show graduation as unavailable.

## Rebuild the file the app loads

```bash
npm run build:schools
```

Writes `public/data/schools.json`.

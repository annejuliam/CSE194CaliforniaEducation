import pandas as pd
from pathlib import Path

# Raw data folder will contain the CA School Dashboard files (one for ELA, one for Math), and the output folder named csv will contain the converted CSV files
# Source: https://www.cde.ca.gov/ta/ac/cm/ (ex: eladownload2025.txt saved as dashboardEla2025.txt)
# The 2025 Dashboard uses spring 2025 state test (Smarter Balanced) results
input_folder = Path("data/raw") #dashboard txt files
output_folder = Path("data/csv")

output_folder.mkdir(parents=True, exist_ok=True)

# The Dashboard stores its color rating as a number, 0 means the school didn't get a color
# (usually too few students tested or no prior year to compare to)
colors = {
    "1": "Red",
    "2": "Orange",
    "3": "Yellow",
    "4": "Green",
    "5": "Blue",
}


# Convert every Dashboard file in the raw folder
for file in input_folder.glob("dashboard*.txt"):
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

    # Keep only school rows (rtype S) for all students together (the file also has student groups)
    df = df[
        (df["rtype"] == "S") &
        (df["studentgroup"] == "ALL")
    ]

    # Check that the CDS code can be split into county, district, and school codes
    assert (df["cds"].str.len() == 14).all(), "CDS codes should be 14 digits"

    # Keep the columns we need, with names that match the free/reduced lunch CSV
    df = pd.DataFrame({
        "County Code": df["cds"].str[:2],
        "District Code": df["cds"].str[2:7],
        "School Code": df["cds"].str[7:],
        "County Name": df["countyname"],
        "District Name": df["districtname"],
        "School Name": df["schoolname"],
        "Charter": df["charter_flag"].fillna("N"),
        # Average points above (+) or below (-) the "Standard Met" score, blank if too few students
        "Distance from Standard": df["currstatus"],
        "Students Tested": df["currdenom"],
        "Dashboard Color": df["color"].map(colors),
    })

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

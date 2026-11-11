
import pandas as pd
from pathlib import Path

# Raw data folder will contain the original Excel files, and the output folder named csv will contain the converted CSV files
input_folder = Path("data/raw") #xlsx files 
output_folder = Path("data/csv")

output_folder.mkdir(parents=True, exist_ok=True)

# Check if a sheet has school-level information
def find_header_row(file, sheet):
    preview = pd.read_excel(
        file, sheet_name=sheet,
        header=None, nrows=30, dtype=str
    )

    for i, row in preview.iterrows():
        columns = [
            str(value).strip().lower().replace("\n", " ")
            for value in row if pd.notna(value)
        ]

        # Look for the columns in California school datasets
        has_school = "school name" in columns
        has_school_code = (
            "school code" in columns or
            "cds code" in columns
        )

        if has_school and has_school_code:
            return i

    return None


# Convert every Excel file in the raw folder
for file in input_folder.glob("*.xlsx"):
    print(f"\nReading {file.name}...")

    excel = pd.ExcelFile(file)

    for sheet in excel.sheet_names:
        header_row = find_header_row(file, sheet)

        if header_row is None:
            print(f"Skipping: {sheet}")
            continue

        print(f"Found school data in: {sheet}")

        # Read the data using the correct header
        df = pd.read_excel(
            file,
            sheet_name=sheet,
            header=header_row,
            dtype=str
        )

        # Remove completely empty rows and columns
        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        # Make column names easier to work with
        df.columns = [
            str(col).strip().replace("\n", " ")
            for col in df.columns
        ]

        # Create a safe CSV filename
        safe_sheet = "".join(
            c if c.isalnum() or c in "-_" else "_"
            for c in sheet
        )

        output_path = output_folder / (
            f"{file.stem}_{safe_sheet}.csv"
        )

        df.to_csv(
            output_path,
            index=False,
            encoding="utf-8-sig"
        )

        print(f"Saved {len(df)} rows to {output_path}")

print("\nFinished converting files!")

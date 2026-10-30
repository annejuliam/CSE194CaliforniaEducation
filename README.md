# CSE 194 California Education

## Pilot data contribution — Naifu Liang

A 19-school San Diego Unified pilot is available in [data/pilot](data/pilot). It joins three official CDE datasets on 14-digit CDS identifiers. This is a development sample, not statewide coverage or a completed website.

- Start with [the data notes](data/pilot/README.txt) and [Excel workbook](data/pilot/school_data_pilot.xlsx).
- Map input: [GeoJSON](data/pilot/schools_sample.geojson); tabular input: CSV or JSON in the same folder.
- Field definitions, sources, original selected rows and validation results are included.
- FRPM eligibility is not household income. Graduation uses the Dashboard combined four-/five-year measure. Four Kearny schools share coordinates and must remain individually selectable.

## Status and next steps

Data preparation and automated checks completed; human source review and website integration pending. The team still needs to agree on coverage, assign map/UI ownership, and select any additional indicators. No decisions on those items are implied by this contribution.

## Reproducing the data join

Use Python with `pip install -r requirements.txt`. Place the official downloads below in `data/raw/`, then run `python scripts/prepare_pilot.py` from the repository root:

- `schools.txt`: https://www.cde.ca.gov/schooldirectory/report?rid=dl1&tp=txt
- `frpm2425.xlsx`: https://www.cde.ca.gov/ds/ad/documents/frpm2425.xlsx
- `grad2025.txt`: https://www3.cde.ca.gov/researchfiles/cadashboard/graddownload2025.txt

The checked-in results use the directory snapshot documented in the data notes. The directory URL is live: compare input hashes against `data/pilot/validation.json` before reproducing the original result. For a new snapshot, update the snapshot date in the script and review changes. This script rebuilds CSV, JSON, GeoJSON, selected source rows and validation; it does not rebuild the Excel workbook or metadata documents.

## AI disclosure

OpenAI Codex assisted with source discovery, processing, validation and documentation. Team review is pending. Retain the associated conversation for the course AI disclosure requirements.

## Offline review preview

Download the repository and open `preview/index.html` in a browser. No server, API key or installation is needed. The page contains all 19 records, a school selector, source links, period labels and a warning for co-located schools. It is a data review aid, not the final map or website.

After changing the JSON data, run `python scripts/build_preview.py` to refresh the embedded snapshot. Run `python scripts/check_pilot.py` to check source-row and export consistency. Edit `preview/template.html`, not the generated page.

See [Naifu's contribution record](docs/CONTRIBUTION.md) and [integration guidance](docs/DATA_INTEGRATION.md).

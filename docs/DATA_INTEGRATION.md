# Pilot data integration

Contribution: Naifu Liang. Data cleaning, joining, validation and exports are complete for 19 schools. Team review and website integration remain pending.

## Load the data

Use `data/pilot/schools_sample.geojson` for maps or `schools_sample.json` for a school list. Serve or import these files through the app; a filesystem URL is not a web endpoint. GeoJSON coordinates are `[longitude, latitude]`. Use the 14-character `cds_code` string as the unique key, never the name or coordinates.

## Display contract

- School name: `school_name`; district: `district`.
- Economic indicator: `frpm_eligible_share`, label “FRPM eligibility (K–12), 2024–25”. It is not household income or a direct poverty rate.
- Graduation indicator: `grad_combined_share`, label “Combined 4-/5-year graduation rate, 2025 Dashboard”.
- Shares are 0–1. Format as percentages exactly once; for example 0.951 becomes 95.1%.
- Show years and source links beside the indicators. The current directory snapshot is not a historical school boundary.
- Treat missing or suppressed values as unavailable, never zero. Do not display fields absent from this pilot as measured values.
- Four Kearny schools share a coordinate. A marker must open a list of all matching CDS records; do not collapse them into one school or move their points silently.
- Keep neutral labels; do not derive a “school quality” score or imply causality from these two indicators.

## Integration acceptance checks

1. All 19 unique school records appear in the list and remain selectable on the map.
2. Choosing any co-located Kearny school shows its own metrics.
3. Percentages match the source-backed records; missing-value behavior is tested using a separate test fixture, not by altering source data.
4. The page identifies this as a San Diego Unified high-school pilot, not representative statewide coverage.
5. Source links, period labels, keyboard-accessible selection and visible focus are present.

## Unresolved team decisions

Confirm the prototype scope and map owner before changing coverage or building a parallel frontend. The pilot omits household income, taxes, test scores, demographic composition and college enrollment. Adding these requires explicit geographic, year and population alignment.

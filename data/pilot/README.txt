CSE 194 / CSE 291A — school data pilot
Prepared 2026-10-29 (America/Los_Angeles)

DELIVERABLE
19 schools in San Diego Unified. This is an engineering pilot, not a representative sample of California or all San Diego schools. No ranking, causal inference, or composite quality score has been produced.

SELECTION AND JOIN
Start with the live CDE directory. Filter County=San Diego, District=San Diego Unified, StatusType=Active, SOCType=High Schools (Public), EdOpsName=Traditional, Charter=N. Retain every resulting row, sorted by school name and CDS code; do not select by outcomes. This excludes charter schools, alternative schools, other school types, and other districts. The current-school filter also introduces survivorship limits for historical analysis.
Join FRPM on county code (2 digits) + district code (5) + school code (7). Join graduation on cds, selecting rtype=S, studentgroup=ALL, reportingyear=2025. Validate one-to-one keys before joining. Names are display text, not join keys. Preserve identifiers as strings.

YEARS AND POPULATIONS
FRPM uses 2024-2025 school census enrollment. Graduation uses the 2025 Dashboard combined four-/five-year graduation measure associated with 2024-25. These share a school-year label but do not describe the same individual students. Current directory coordinates are a 2026-10-29 snapshot, not historical attendance boundaries. 2024-25 was chosen as a fixed pilot period, not asserted to be the newest available data.

METRICS
FRPM eligibility is a school-level economic-background proxy, not mean household income, meal participation, or a direct poverty rate. Categorical eligibility also contributes. Graduation is the Dashboard combined measure, not a four-year-only rate. Read the data dictionary and linked methodology before relabeling either metric. JSON/CSV shares use 0–1; multiply by 100 once for percentage display. The published graduation rate is rounded to one decimal percentage point.

VALIDATION PERFORMED
19 unique CDS keys, all 19 match both metric sources, no missing coordinates or required metric values. Every FRPM share matches its count/enrollment; every graduation share agrees with numerator/denominator within the official rounding precision. Coordinates pass a coarse San Diego bounding check, not an on-site location audit. Source hashes and checks are in validation.json, original selected rows in source_rows.json. No invented values or zero-filled missing values.
Four Kearny schools have the same coordinates. Keep their distinct CDS records and use a cluster/list selector in the map. Do not overwrite records by coordinate or silently move the points.

FILES
school_data_pilot.xlsx: filterable sample, field dictionary, source register and remaining scope.
schools_sample.csv / schools_sample.json: flat records for development.
schools_sample.geojson: map points with [longitude, latitude].
data_dictionary.json: exact fields, units, source mappings.
source_register.json: data, methodology, context and comparison products separated.
source_rows.json: original selected official source rows for audit.
validation.json: checks and hashes of full downloaded source files.

MISSING OR DEFERRED
No household income, property tax, racial/gender composition, test scores, college enrollment, or school resources are included. Those fields must not appear as zero in a UI. Household income would require a separately sourced geographic unit and year; a school point does not identify its students' households. Test scores require a chosen grade/subject/population. Any expansion should retain unavailable/suppressed values as null plus a reason, not impute or discard silently.

NEXT TEAM DECISIONS
1. Confirm whether this high-school pilot is suitable before expanding statewide.
2. Assign named owners for data, map UI and source verification in the existing Gantt chart.
3. Integrate the GeoJSON and field dictionary into the existing repository, after reviewing its data contract.
4. Support coincident-school selection, clear year/source labels, and missing-value display.
5. Verify a genuinely missing feature versus Ed-Data and the California School Dashboard. Existing comparisons alone do not establish novelty.
6. Expand the bibliography with substantive research/context. The source register is not a claim that the course's 10-source requirement has been met; methodology pages and the same data's download page should not be used merely to inflate the count.

PROGRESS FACTS FOR TEAM REVIEW
Created a 19-school pilot by joining three official CDE data sources on CDS identifiers. Added a data dictionary, source register, validation results and GeoJSON export. Identified four co-located Kearny schools that the map must keep separately selectable. Remaining work includes repository integration, broader coverage and team review of indicator definitions. These are completed data-preparation steps, not a deployed website or completed group assignment.

AI DISCLOSURE
OpenAI Codex assisted with source discovery, data extraction, joins, validation and documentation. Automated checks were performed; human team review is still pending. Retain this conversation for the course's final AI disclosure. This package is a team development contribution, not a formal course submission.

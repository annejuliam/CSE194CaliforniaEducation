# School comparison pilot

The comparison section now lets visitors select two schools and view enrollment,
meal eligibility, and the combined graduation rate. This is a 19-school San Diego
Unified pilot, not statewide coverage. It does not depend on the unfinished map.

## Where to start

- `src/pages/Comparison.jsx`: two selected CDS IDs in React state, a reusable
  school selector, three metric definitions, and the table.
- `src/pages/page-styles/Comparison.css`: wrapping selectors and horizontal table
  scrolling on narrow screens.
- `src/data/schools_sample.json`: unchanged, previously prepared pilot records.
- `src/data/PILOT_NOTES.txt`: selection, join rules, years, and limitations.
- `src/data/source_register.json`: original source URLs and methodology references.

CDS IDs remain strings. Do not join by name or coordinates. Shares are stored as
0–1 fractions and formatted as percentages exactly once. Missing values display
“Not available”; a numeric zero remains zero. Selecting the same school twice is
allowed and displays an explanatory message.

## Data period

Enrollment and FRPM are from 2024–25. Graduation is the 2025 Dashboard combined
four-/five-year measure, not a four-year-only rate. Its denominator differs from
enrollment. Directory selection is an October 29, 2026 snapshot. FRPM is not
household income. The newer 2025–26 FRPM export elsewhere in the repository is
intentionally not mixed into this fixed-period pilot.

Income, test scores, spending, staffing and AP/IB metrics are not supplied by this
pilot. The page explains that limitation instead of inventing comparison values.
To expand coverage, first agree on source year/population and validate unique CDS
keys; then replace the data and update the on-page scope and period labels together.

## Review and run

This branch is based on Bob's `integrate/annejulia` (PR #2). Review this PR against
that branch so Bob's layout changes are not duplicated in our diff. Once PR #2
lands, retarget this PR to main and resolve any new changes before merging.

Run `npm ci`, `npm run lint`, `npm run build`, and `npm run dev`.
Check both selectors, same-school selection, all four Kearny records, keyboard
access, and the table on a narrow screen. Example: Canyon Hills enrollment is
1,183, meal eligibility is 58.5%, and combined graduation is 95.1%.

OpenAI Codex assisted with implementation and documentation. Team review pending.

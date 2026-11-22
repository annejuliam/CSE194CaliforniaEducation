# California Public Schools: Does Inequality Shape Education?

A CSE 194 group project exploring educational opportunity with public school data.
The React prototype compares **19 traditional, non-charter public high schools in
San Diego Unified**. It is not a representative statewide sample.

## Run a fresh copy

Prerequisites: Git, Node.js 22.12+ (or Node.js 24/26), and npm.

```sh
git clone https://github.com/annejuliam/CSE194CaliforniaEducation.git
cd CSE194CaliforniaEducation
npm ci
npm run dev
```

Open the local URL Vite prints, normally `http://localhost:5173`. No API key,
account, Python environment, or separate data download is required for this
bundled pilot. Stop the server with Ctrl+C.

```sh
npm run lint
npm run build
npm run preview
```

The build creates `dist/`. Preview serves it locally, normally at
`http://localhost:4173`; this command does not publish the site.

## What works, and what remains

- Website sections and navigation, with layout fixes from merged PR #2.
- Two school selectors and enrollment, FRPM eligibility, and graduation values
  from merged PR #3. Choosing the same school shows an explanatory message.
- Data-period, source, and coverage labels alongside the comparison.
- **Not done:** interactive map, map filters, downloadable comparison CSV,
  statewide coverage, and household-income/resource comparisons.
- **Not verified:** latest public deployment and complete mobile interaction
  testing. The existing prototype is <https://teal-lily-7fcc0c.netlify.app/>;
  do not assume it tracks current main.

The guiding question is broader than this pilot's evidence. Current data cannot
establish a causal effect of income on outcomes or rank school quality.

## Data and research

Enrollment and FRPM use 2024–25 data; graduation is the 2025 Dashboard combined
four-/five-year measure. Directory selection uses an October 29, 2026 snapshot.
These measures do not describe the same student cohort. FRPM eligibility is not
household income, individual poverty, or actual meal participation.

- [Annotated resources](docs/RESOURCES.md): data, methods, research, and existing tools.
- [Comparison handoff](docs/SCHOOL_COMPARISON.md): code locations and manual checks.
- [Pilot methodology](src/data/PILOT_NOTES.txt): selection, join rules, and limits.
  Its file inventory describes the original pilot package, not files all copied
  into this app.
- [Source register](src/data/source_register.json): original pilot provenance.
- [Delivery checklist](docs/DELIVERY_CHECKLIST.md): remaining course deliverables.

`src/data/schools_sample.json` is the fixed pilot used by the interface. Additional
branch data is not automatically connected to the interface. Join by CDS ID,
never name or coordinates. Four Kearny schools share coordinates but are distinct.

## Maintenance and contact

Last documentation update: **November 22, 2026**. The data is a fixed snapshot;
there is no automatic refresh or committed post-course update schedule. Record
future refreshes' sources, years, populations, checks, and coverage changes, and
update the interface labels with them.

Report reproducible problems through
[GitHub Issues](https://github.com/annejuliam/CSE194CaliforniaEducation/issues).
Include school, metric, expected/source value, and reproduction steps; do not
post private student information. The team must still designate a named
course-staff contact and email, with agreed 24-hour response availability through
Friday of finals week. That commitment is not assigned here.

## AI assistance

OpenAI Codex assisted with pilot preparation, comparison code, documentation,
source discovery, and code review. Local checks do not replace human understanding
or teammate review. The comparison displays public data; it does not run an AI
model or predict outcomes. Retain relevant AI conversations for the course
submission and include disclosure on presentation slides. This note does not
replace those conversation records.

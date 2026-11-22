import { useState } from 'react';
import schools from '../data/schools_sample.json';
import './page-styles/Comparison.css';

// Keep the original CDS identifier as a string: school names and coordinates
// are not unique identifiers (four Kearny schools share the same location).
const measures = [
    { label: 'Enrollment (K–12)', field: 'enrollment_k12', percent: false },
    { label: 'Free / reduced-price meal eligibility', field: 'frpm_eligible_share', percent: true },
    { label: 'Combined four-/five-year graduation rate', field: 'grad_combined_share', percent: true },
];

function formatValue(value, percent = false) {
    // Do not coerce null or an empty string to zero. A real zero is valid data.
    if (typeof value !== 'number' || !Number.isFinite(value)) return 'Not available';
    // Source shares are fractions (0–1); Intl performs the percentage conversion.
    return new Intl.NumberFormat('en-US', percent
        ? { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }
        : { maximumFractionDigits: 0 }).format(value);
}

function SchoolSelector({ label, value, onChange }) {
    return (
        <label className="school-selector">
            {label}
            <select value={value} onChange={(event) => onChange(event.target.value)}>
                {schools.map((school) => (
                    <option key={school.cds_code} value={school.cds_code}>
                        {school.school_name}
                    </option>
                ))}
            </select>
        </label>
    );
}

function Comparison() {
    const [firstId, setFirstId] = useState(schools[0].cds_code);
    const [secondId, setSecondId] = useState(schools[1].cds_code);
    const firstSchool = schools.find((school) => school.cds_code === firstId);
    const secondSchool = schools.find((school) => school.cds_code === secondId);

    return (
        <section id="comparison" className="comparison-section">
            <div className="comparison-content">
                <h2>Side-by-Side Comparison</h2>
                <p>Explore a pilot of 19 traditional, non-charter public high schools in
                    San Diego Unified. This sample does not represent all California schools.</p>
                <div className="school-selectors">
                    <SchoolSelector label="School A" value={firstId} onChange={setFirstId} />
                    <SchoolSelector label="School B" value={secondId} onChange={setSecondId} />
                </div>
                {firstId === secondId && <p role="status">You are viewing the same school twice.</p>}
                <div className="comparison-scroll" tabIndex="0" role="region" aria-label="School comparison table">
                    <table className="comparison-table">
                        <caption>Enrollment and meal eligibility: 2024–25. Graduation: 2025 Dashboard.</caption>
                        <thead>
                            <tr>
                                <th scope="col">Measure</th>
                                <th scope="col">{firstSchool.school_name}</th>
                                <th scope="col">{secondSchool.school_name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {measures.map(({ label, field, percent }) => (
                                <tr key={field}>
                                    <th scope="row">{label}</th>
                                    <td>{formatValue(firstSchool[field], percent)}</td>
                                    <td>{formatValue(secondSchool[field], percent)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>Meal eligibility is not household income. Graduation combines four- and
                    five-year outcomes; its cohort is different from the enrollment population.
                    These indicators are not a school quality ranking.</p>
                <p>Household income, test scores, spending, staffing ratios, and AP/IB offerings
                    are not available in this pilot.</p>
                <p>Sources: <a href="https://www.cde.ca.gov/ds/ad/filessp.asp">CDE meal eligibility and enrollment</a>
                    {' · '}<a href="https://www.cde.ca.gov/ta/ac/cm/graddatafiles.asp">CDE graduation data</a>.
                    School selection uses the CDE directory snapshot from October 29, 2026.</p>
            </div>
        </section>
    );
}

export default Comparison;

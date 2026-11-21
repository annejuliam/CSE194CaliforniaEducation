
const measures = [
    "Median Household Income (area)",
    "CA School Dashboard - ELA",
    "CA School Dashboard - Math",
    "Per-Pupil Spending",
    "Student to Teacher Ratio",
    "AP/IB Courses Offered",
    "Graduation Rate"
];

function Comparison() {
    return (
        <section id="comparison" className="comparison-section">
            <div className="comparison-content">
                <h2>Side-by-Side Comparison</h2>

                <br />

                <p>
                    Use our interactive map to compare schools in different
                    areas of California. Explore how household income,
                    school performance, student demographics, and
                    educational resources vary across the state.
                </p>

                <br />

                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th scope="col">Measure</th>
                            <th scope="col">School A -</th>
                            <th scope="col">School B -</th>
                        </tr>
                    </thead>

                    <tbody>
                        {measures.map((measure) => (
                            <tr key={measure}>
                                <td>{measure}</td>
                                <td>—</td>
                                <td>—</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default Comparison;

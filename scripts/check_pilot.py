"""Validate delivered formats against preserved official source rows."""
from pathlib import Path
import csv, json, math
p = Path(__file__).resolve().parents[1] / 'data/pilot'
rows = json.loads((p/'schools_sample.json').read_text())
evidence = {r['cds_code']: r for r in json.loads((p/'source_rows.json').read_text())}
geo = json.loads((p/'schools_sample.geojson').read_text())['features']
with (p/'schools_sample.csv').open() as f:
    csvrows = list(csv.DictReader(f))
assert len(rows) == len(evidence) == len(geo) == len(csvrows) == 19
assert len({r['cds_code'] for r in rows}) == 19
for r, feature, c in zip(rows, geo, csvrows):
    key = r['cds_code']; e = evidence[key]; d, f, g = e['directory'], e['frpm'], e['graduation']
    assert key == d['CDSCode'] == f['cds_code'] == g['cds']
    assert r['school_name'] == d['School'] and r['district'] == d['District']
    assert r['latitude'] == float(d['Latitude']) and r['longitude'] == float(d['Longitude'])
    assert r['enrollment_k12'] == int(f['Enrollment (K-12)'])
    assert r['frpm_eligible_count'] == int(f['FRPM Count (K-12)'])
    assert math.isclose(r['frpm_eligible_share'], float(f['Percent (%) Eligible FRPM (K-12)']))
    assert math.isclose(r['frpm_eligible_share'], r['frpm_eligible_count']/r['enrollment_k12'])
    assert r['grad_combined_count'] == int(g['currnumer'])
    assert r['grad_combined_cohort'] == int(g['currdenom'])
    assert math.isclose(r['grad_combined_share'], float(g['currstatus'])/100)
    assert abs(r['grad_combined_share']*100-r['grad_combined_count']/r['grad_combined_cohort']*100) <= .051
    assert feature['id'] == key and feature['properties'] == r
    assert feature['geometry']['coordinates'] == [r['longitude'], r['latitude']]
    assert set(c) == set(r)
    for k,v in r.items():
        assert (math.isclose(float(c[k]),v) if isinstance(v,(int,float)) else c[k] == v), (key,k)
print('PASS: 19 records match preserved source rows; CSV, JSON and GeoJSON agree. Team review pending.')

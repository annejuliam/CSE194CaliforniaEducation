"""Build an offline data review page from the checked-in pilot."""
from pathlib import Path
import json
root = Path(__file__).resolve().parents[1]
rows = json.loads((root/'data/pilot/schools_sample.json').read_text())
template = (root/'preview/template.html').read_text()
payload = json.dumps(rows, ensure_ascii=False).replace('<', '\\u003c')
(root/'preview/index.html').write_text(template.replace('__PILOT_DATA__', payload))
print(f'Built preview for {len(rows)} schools')

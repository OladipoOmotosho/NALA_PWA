"""Regenerate src/domain/taxonomy.ts from the source workbook's Taxonomy sheet.

Usage (from the app/ directory):
    python scripts/generate-taxonomy.py

The sheet is a 105-row hierarchy: Category > Equipment Type > Component >
Subcomponent, with each leaf carrying a Focus Area description and a
semicolon-separated list of Deficiency Mechanisms. Every full path is unique
(validated here), which is what the app's cascading selects rely on.
"""
import warnings, json, os, sys
from collections import Counter

warnings.filterwarnings("ignore")
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
WORKBOOK = os.path.join(HERE, "..", "..", "Nerizon_Structural_Integrity_Assessment_NALA.xlsx")
OUT = os.path.join(HERE, "..", "src", "domain", "taxonomy.ts")

wb = openpyxl.load_workbook(WORKBOOK, data_only=True)
ws = wb["Taxonomy"]

rows = []
for r in ws.iter_rows(min_row=2, values_only=True):
    if r[0] is None:
        continue
    category, equipment, component, sub, focus, mechs = (str(c).strip() if c else "" for c in r[:6])
    rows.append(
        {
            "category": category,
            "equipmentType": equipment,
            "component": component,
            "subcomponent": sub,
            "focusArea": focus,
            "mechanisms": [m.strip() for m in mechs.split(";") if m.strip()],
        }
    )

# Validate: full paths must be unique or the cascade would be ambiguous.
paths = Counter((r["category"], r["equipmentType"], r["component"], r["subcomponent"]) for r in rows)
dups = [k for k, v in paths.items() if v > 1]
if dups:
    sys.exit(f"ABORT: duplicate taxonomy paths would break the cascade: {dups}")

ts = []
ts.append("// GENERATED from Nerizon_Structural_Integrity_Assessment_NALA.xlsx (Taxonomy sheet, 105 rows).")
ts.append("// Regenerate with scripts/generate-taxonomy.py rather than editing by hand.")
ts.append("// Hierarchy: Category > Equipment Type > Component > Subcomponent > { focusArea, mechanisms }.")
ts.append("")
ts.append("export interface TaxonomyRow {")
ts.append("  category: string;")
ts.append("  equipmentType: string;")
ts.append("  component: string;")
ts.append("  subcomponent: string;")
ts.append("  focusArea: string;")
ts.append("  mechanisms: string[];")
ts.append("}")
ts.append("")
ts.append(f"export const TAXONOMY: TaxonomyRow[] = {json.dumps(rows, ensure_ascii=False, indent=2)};")
ts.append("")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(ts))

cats = Counter(r["category"] for r in rows)
print(f"written {OUT}: {len(rows)} rows, categories: {dict(cats)}")

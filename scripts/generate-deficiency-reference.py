"""Regenerate src/domain/deficiencyReference.ts from the workbook's Deficiency Reference sheet.

Usage (from the app/ directory):
    python scripts/generate-deficiency-reference.py

19 deficiency categories: Code | Deficiency Category | Definition |
Water Treatment / Closed Mine Site Relevance. This is the full reference set —
it includes LOC, OPR, FLW and MSB, which the workbook's 15-code Inspections
picklist omits but the Taxonomy sheet's mechanism lists use.
"""
import warnings, json, os, sys

warnings.filterwarnings("ignore")
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
WORKBOOK = os.path.join(HERE, "..", "..", "Nerizon_Structural_Integrity_Assessment_NALA.xlsx")
OUT = os.path.join(HERE, "..", "src", "domain", "deficiencyReference.ts")

wb = openpyxl.load_workbook(WORKBOOK, data_only=True)
ws = wb["Deficiency Reference"]

rows = []
for r in ws.iter_rows(min_row=2, values_only=True):
    if r[0] is None:
        continue
    code, name, definition, relevance = (str(c).strip() if c else "" for c in r[:4])
    rows.append(
        {
            "code": code,
            "name": name,
            "label": f"{code} - {name}",
            "definition": definition,
            "siteRelevance": relevance,
        }
    )

codes = [r["code"] for r in rows]
if len(set(codes)) != len(codes):
    sys.exit(f"ABORT: duplicate deficiency codes: {codes}")

ts = []
ts.append("// GENERATED from Nerizon_Structural_Integrity_Assessment_NALA.xlsx (Deficiency Reference sheet).")
ts.append("// Regenerate with scripts/generate-deficiency-reference.py rather than editing by hand.")
ts.append("// Full 19-code reference set — a superset of the workbook's 15-code Inspections picklist;")
ts.append("// the extra codes (LOC, OPR, FLW, MSB) are used by the Taxonomy sheet's mechanism lists.")
ts.append("")
ts.append("export interface DeficiencyReferenceEntry {")
ts.append("  code: string;")
ts.append("  name: string;")
ts.append('  /** "CODE - Name", the format used across the workbook and the Taxonomy mechanisms. */')
ts.append("  label: string;")
ts.append("  definition: string;")
ts.append("  siteRelevance: string;")
ts.append("}")
ts.append("")
ts.append(f"export const DEFICIENCY_REFERENCE: DeficiencyReferenceEntry[] = {json.dumps(rows, ensure_ascii=False, indent=2)};")
ts.append("")
ts.append("export function deficiencyByCode(code: string): DeficiencyReferenceEntry | undefined {")
ts.append("  return DEFICIENCY_REFERENCE.find((d) => d.code === code);")
ts.append("}")
ts.append("")
ts.append("export function deficiencyByLabel(label: string): DeficiencyReferenceEntry | undefined {")
ts.append("  return DEFICIENCY_REFERENCE.find((d) => d.label === label);")
ts.append("}")
ts.append("")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(ts))
print(f"written {OUT}: {len(rows)} codes: {', '.join(codes)}")

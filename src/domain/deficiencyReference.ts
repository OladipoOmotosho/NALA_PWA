// GENERATED from Nerizon_Structural_Integrity_Assessment_NALA.xlsx (Deficiency Reference sheet).
// Regenerate with scripts/generate-deficiency-reference.py rather than editing by hand.
// Full 19-code reference set — a superset of the workbook's 15-code Inspections picklist;
// the extra codes (LOC, OPR, FLW, MSB) are used by the Taxonomy sheet's mechanism lists.

export interface DeficiencyReferenceEntry {
  code: string;
  name: string;
  /** "CODE - Name", the format used across the workbook and the Taxonomy mechanisms. */
  label: string;
  definition: string;
  siteRelevance: string;
}

export const DEFICIENCY_REFERENCE: DeficiencyReferenceEntry[] = [
  {
    "code": "CML",
    "name": "Corrosion & Material Loss",
    "label": "CML - Corrosion & Material Loss",
    "definition": "General or localized wall thinning from corrosion, pitting, crevice attack, microbiologically influenced corrosion (MIC), or corrosion under insulation.",
    "siteRelevance": "Accelerated by low pH, high sulfate/chloride content, and dissolved metals typical of acid mine drainage (AMD); prevalent on wetted steel in clarifiers, reactors, and piping."
  },
  {
    "code": "CRK",
    "name": "Cracking Mechanisms",
    "label": "CRK - Cracking Mechanisms",
    "definition": "Fatigue cracking, stress corrosion cracking, weld/HAZ cracking, thermal fatigue.",
    "siteRelevance": "Relevant at agitator shafts, rake arm welds, and dosing skid frames subject to cyclic/vibration loading."
  },
  {
    "code": "DFI",
    "name": "Deformation & Mechanical Damage",
    "label": "DFI - Deformation & Mechanical Damage",
    "definition": "Bulging, buckling, dents, distortion, misalignment, impact damage.",
    "siteRelevance": "Common on silo shells, rake arms, and pipe supports exposed to abrasive slurry or mobile-equipment impact."
  },
  {
    "code": "CFI",
    "name": "Connection & Joint Failures",
    "label": "CFI - Connection & Joint Failures",
    "definition": "Bolted, welded, or flanged connection failures; anchor bolt failure; gasket/seal degradation.",
    "siteRelevance": "Frequent at flanged chemical piping joints and anchor bolts exposed to corrosive spillage or washdown."
  },
  {
    "code": "FDS",
    "name": "Foundation & Settlement",
    "label": "FDS - Foundation & Settlement",
    "definition": "Differential settlement, grout deterioration, drainage-related undermining of foundations.",
    "siteRelevance": "Elevated risk where structures bear on fill placed over disturbed or reclaimed mine ground."
  },
  {
    "code": "CND",
    "name": "Concrete Deterioration",
    "label": "CND - Concrete Deterioration",
    "definition": "Cracking, spalling, scaling, sulfate attack, reinforcement corrosion, freeze-thaw damage.",
    "siteRelevance": "Sulfate attack and reinforcement corrosion risk are elevated by contact with acidic, sulfate-rich mine water in tanks, basins, and foundations."
  },
  {
    "code": "ENV",
    "name": "Environmental & External Damage",
    "label": "ENV - Environmental & External Damage",
    "definition": "Wind, snow/ice, UV degradation, external impact, corrosive atmosphere.",
    "siteRelevance": "Open basins and reactors create a humid, corrosive atmosphere around structural steel and coatings."
  },
  {
    "code": "GHK",
    "name": "General Housekeeping & Maintenance",
    "label": "GHK - General Housekeeping & Maintenance",
    "definition": "Missing components, poor maintenance, debris accumulation, trip hazards.",
    "siteRelevance": "Applies broadly to walkways, platforms, and access structures across the site."
  },
  {
    "code": "MSI",
    "name": "Modification & Structural Integrity",
    "label": "MSI - Modification & Structural Integrity",
    "definition": "Unauthorized modification, addition of load without design review.",
    "siteRelevance": "Watch for field-added platforms, piping, or equipment not reflected in original design basis."
  },
  {
    "code": "THR",
    "name": "Fire & Thermal Damage",
    "label": "THR - Fire & Thermal Damage",
    "definition": "Fire exposure, thermal cycling, thermal shock.",
    "siteRelevance": "Includes exothermic heat generated during lime slaking, and any electrical/fire risk areas."
  },
  {
    "code": "EWF",
    "name": "Envelope Failure",
    "label": "EWF - Envelope Failure",
    "definition": "Water ingress, roof/wall seal or membrane failure, loss of weatherproofing.",
    "siteRelevance": "Relevant to chemical storage buildings and roofed control/electrical buildings."
  },
  {
    "code": "SIE",
    "name": "Soil Instability & Erosion",
    "label": "SIE - Soil Instability & Erosion",
    "definition": "Soil erosion, washed-out backfill, voids from poor drainage or water infiltration.",
    "siteRelevance": "Heightened around basins/ponds and discharge structures with continuous water contact."
  },
  {
    "code": "FH",
    "name": "Frost Heave",
    "label": "FH - Frost Heave",
    "definition": "Ground movement (upward heave, cracking) from freeze-thaw cycling in frost-susceptible soils.",
    "siteRelevance": "Climate-dependent; relevant for shallow foundations in cold-climate sites."
  },
  {
    "code": "BCF",
    "name": "Bearing Capacity Failure",
    "label": "BCF - Bearing Capacity Failure",
    "definition": "Sudden or local settlement/collapse from inadequate soil bearing capacity.",
    "siteRelevance": "Higher risk over loosely placed mine backfill or areas with undocumented ground disturbance."
  },
  {
    "code": "PF",
    "name": "Pile Foundations",
    "label": "PF - Pile Foundations",
    "definition": "Pile misalignment, breakage, or structural defects in deep foundation elements.",
    "siteRelevance": "Applies where piles were used to bridge poor or disturbed mine-site ground."
  },
  {
    "code": "LOC",
    "name": "Leakage / Loss of Containment",
    "label": "LOC - Leakage / Loss of Containment",
    "definition": "Seal, gasket, or pressure-boundary leakage.",
    "siteRelevance": "Priority item for chemical containment and any pressurized process/membrane equipment."
  },
  {
    "code": "OPR",
    "name": "Operational & Process-Related Damage",
    "label": "OPR - Operational & Process-Related Damage",
    "definition": "Fouling, scaling, blockages, or damage from operating outside design conditions.",
    "siteRelevance": "Scaling from iron/manganese/gypsum precipitation is common in mine-water treatment process equipment."
  },
  {
    "code": "FLW",
    "name": "Flow-Induced Damage",
    "label": "FLW - Flow-Induced Damage",
    "definition": "Erosion, abrasion, and cavitation from high-velocity or particulate-laden flow.",
    "siteRelevance": "A leading damage mechanism here given abrasive lime slurry, HDS recycle, and thickened sludge streams."
  },
  {
    "code": "MSB",
    "name": "Mine Subsidence & Ground Instability",
    "label": "MSB - Mine Subsidence & Ground Instability",
    "definition": "Void migration, subsidence, or sinkhole formation from collapse of underlying abandoned mine workings.",
    "siteRelevance": "Site-specific risk category added for this closed mine site; warrants geotechnical desktop review of historic workings beneath structures."
  }
];

export function deficiencyByCode(code: string): DeficiencyReferenceEntry | undefined {
  return DEFICIENCY_REFERENCE.find((d) => d.code === code);
}

export function deficiencyByLabel(label: string): DeficiencyReferenceEntry | undefined {
  return DEFICIENCY_REFERENCE.find((d) => d.label === label);
}

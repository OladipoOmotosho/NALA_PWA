// GENERATED from Nerizon_Structural_Integrity_Assessment_NALA.xlsx (hidden Lookups sheet + Details + Deficiency Reference).
// Regenerate with scripts/generate-lookups.py rather than editing by hand.

export interface DeficiencyCategory {
  code: string;
  label: string;
  definition: string;
  descriptions: string[];
  mechanisms: string[];
  focusAreas: string[];
}

export interface ComponentType {
  name: string;
  subComponents: string[];
}

export const SITES: string[] = ["Blackbird Mine", "Brenda Mine", "Bell Mine", "Grey Eagle Mine", "Geco/Wilroy Mine", "Heath Steele Mine", "Mattabi Mine", "Matagami Mine", "Brunswick Mine", "Montcalm Mine"];

export const PRIORITIES = ["P1", "P2", "P3", "P4", "P5"] as const;
export type PriorityRating = (typeof PRIORITIES)[number];

export const PRIORITY_DESCRIPTIONS: Record<string, string> = {
  "P1": "Critical Condition - Immediate action required",
  "P2": "Poor Condition - Repair actions needed within 12 months",
  "P3": "Bad Condition - Repairs needed within 24 to 36 months",
  "P4": "Fair Condition - Monitor before next scheduled inspection",
  "P5": "Good Condition - No repairs required"
};

export const RISK_LEVELS = ["High", "Medium", "Low"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const DEFICIENCY_CATEGORIES: DeficiencyCategory[] = [
  {
    "code": "CML",
    "label": "CML - Corrosion & Material Loss",
    "definition": "General or localized wall thinning from corrosion, pitting, crevice attack, microbiologically influenced corrosion (MIC), or corrosion under insulation.",
    "descriptions": [
      "Corrosion of steel deck",
      "Corrosion (exposed steel)",
      "Corrosion of grating",
      "Section loss / corrosion",
      "Corrosion at contact points",
      "Corrosion of structural steel",
      "Corrosion / coating failure",
      "Corrosion of exposed steel members (beams, columns)",
      "Rusting of cladding, roofing sheets",
      "Corrosion at roof decks and fasteners",
      "Corrosion of structural steel supports",
      "Corrosion at column bases",
      "Rusted pipe racks / frames"
    ],
    "mechanisms": [
      "Atmospheric corrosion (external exposure)",
      "Coating failure / weathering",
      "Moisture ingress",
      "Atmospheric corrosion",
      "Water accumulation at baseplates",
      "Coating failure"
    ],
    "focusAreas": [
      "Deck / structural support",
      "Vertical load members",
      "Corrosion-prone zones",
      "Access flooring",
      "Corrosion-prone contact points",
      "Structural steel integrity",
      "Secondary structural support"
    ]
  },
  {
    "code": "CND",
    "label": "CND - Concrete Deterioration",
    "definition": "Cracking, spalling, scaling, sulfate attack, reinforcement corrosion, freeze-thaw damage.",
    "descriptions": [
      "Cracking / spalling",
      "Spalling",
      "Surface cracking / structural cracks",
      "Spalling and surface scaling",
      "Exposed rebar in concrete",
      "Degraded concrete surfaces",
      "Spalling at pedestals",
      "Degraded concrete bases",
      "Cracked foundations",
      "Cracking"
    ],
    "mechanisms": [
      "Freeze-thaw cycles",
      "Reinforcement corrosion",
      "Chemical attack",
      "Freeze-thaw damage"
    ],
    "focusAreas": [
      "Load-bearing slab",
      "Concrete integrity / load distribution",
      "Footings / concrete foundation base",
      "Pedestals / localized load supports"
    ]
  },
  {
    "code": "CFI",
    "label": "CFI - Connection & Joint Failures",
    "definition": "Bolted, welded, or flanged connection failures; anchor bolt failure; gasket/seal degradation.",
    "descriptions": [
      "Loose/missing bolts",
      "Missing or loose fittings",
      "Anchor bolt failure",
      "Loose or missing fasteners",
      "Missing or loose anchor bolts",
      "Loose handrails / guardrails",
      "Missing or weak anchorage",
      "Joint leakage in cladding",
      "Missing or broken anchor bolts",
      "Loose connections at supports",
      "Weld failure at beams/joints"
    ],
    "mechanisms": [
      "Bolt loosening / corrosion",
      "Anchor failure",
      "Sealant degradation",
      "Anchor bolt failure",
      "Bolt loosening / creep",
      "Weld defects"
    ],
    "focusAreas": [
      "Access / safety",
      "Safety barriers",
      "Anchorage system",
      "Support fixation & connections",
      "Anchorage / fixing system"
    ]
  },
  {
    "code": "CRK",
    "label": "CRK - Cracking Mechanisms",
    "definition": "Fatigue cracking, stress corrosion cracking, weld/HAZ cracking, thermal fatigue.",
    "descriptions": [
      "Fatigue or weld cracking",
      "Fatigue cracking",
      "Cracks at welds",
      "Cracking in concrete slabs and walls",
      "Surface cracking in concrete",
      "Diagonal cracks in walls",
      "Cracks at welds of supports",
      "Cracking at baseplates or connections",
      "Cracks in structural members"
    ],
    "mechanisms": [
      "Thermal movement / expansion",
      "Shrinkage / aging",
      "Settlement-induced cracking",
      "Fatigue (cyclic loading)",
      "Stress concentration",
      "Overloading"
    ],
    "focusAreas": [
      "Primary framing",
      "Fatigue-prone structural elements",
      "Critical welded connections"
    ]
  },
  {
    "code": "DFI",
    "label": "DFI - Deformation & Mechanical Damage",
    "definition": "Bulging, buckling, dents, distortion, misalignment, impact damage.",
    "descriptions": [
      "Sagging / deformation",
      "Misalignment / deformation",
      "Deflection / overstress",
      "Deformation / instability",
      "Misalignment due to movement",
      "Overloaded / bent supports",
      "Structural deformation",
      "Distortion under load",
      "Overstress / deformation",
      "Sagging roof structures",
      "Warping of cladding panels",
      "Dented wall panels / damaged guardrails",
      "Bent pipe supports",
      "Distorted supports / frames",
      "Damaged columns or racks",
      "Misaligned equipment bases"
    ],
    "mechanisms": [
      "Overloading / overstress",
      "Thermal deformation",
      "Impact (vehicles/equipment)",
      "Overstress / excessive loading",
      "Equipment-induced vibration",
      "Impact (vehicles)",
      "Foundation movement"
    ],
    "focusAreas": [
      "Structural integrity",
      "Alignment / plumb",
      "Load capacity",
      "Access / safety systems",
      "Alignment & load transfer",
      "Structural capacity / load support",
      "Load-bearing structure",
      "Load frame / skid integrity",
      "Primary load path"
    ]
  },
  {
    "code": "EWF",
    "label": "EWF - Envelope Failure",
    "definition": "Water ingress, roof/wall seal or membrane failure, loss of weatherproofing.",
    "descriptions": [
      "Water ingress / leaks",
      "Water ingress"
    ],
    "mechanisms": [
      "Membrane / sealant degradation",
      "Flashing / joint failure",
      "Weathering / UV degradation",
      "Water ingress (rain)",
      "Thermal movement / expansion"
    ],
    "focusAreas": [
      "Weatherproofing / water barrier",
      "Envelope protection"
    ]
  },
  {
    "code": "ENV",
    "label": "ENV - Environmental & External Damage",
    "definition": "Wind, snow/ice, UV degradation, external impact, corrosive atmosphere.",
    "descriptions": [
      "Weather damage (wind/snow)",
      "Vehicle / equipment impact damage",
      "Environmental degradation (snow, rain, wind)",
      "Subsidence / erosion",
      "Impact damage (vehicles)",
      "Roof overstress or collapse risk",
      "Damaged cladding / roofing",
      "Leaks through roof or walls",
      "Deterioration of coatings / sealants",
      "Corrosion due to rain/snow",
      "Movement or instability of supports",
      "Corrosion from process leaks"
    ],
    "mechanisms": [
      "Snow loads / ice buildup",
      "Wind loads / storms",
      "Water ingress (rain)",
      "UV degradation",
      "Weather exposure",
      "Wind loads",
      "Chemical exposure"
    ],
    "focusAreas": [
      "External exposure",
      "External impact exposure",
      "Environmental exposure",
      "External exposure / hazards",
      "Ground stability"
    ]
  },
  {
    "code": "FDS",
    "label": "FDS - Foundation & Settlement",
    "definition": "Differential settlement, grout deterioration, drainage-related undermining of foundations.",
    "descriptions": [
      "Settlement / movement",
      "Settlement / differential settlement",
      "Erosion around foundation",
      "Missing grout under baseplate",
      "Grout deterioration",
      "Uneven settlement",
      "Cracking of foundations",
      "Tilting structures",
      "Loss of soil stiffness / bearing capacity",
      "Uneven floors / slab settlement",
      "Cracking or lifting of slabs",
      "Water accumulation under slabs",
      "Misalignment of pumps or equipment",
      "Tilted structures",
      "Gaps under baseplates",
      "Undermining of foundations",
      "Cracking of slabs/foundations"
    ],
    "mechanisms": [
      "Soil settlement / movement",
      "Frost heave",
      "Poor drainage",
      "Differential settlement",
      "Soil movement / erosion",
      "Missing / degraded grout",
      "Drainage issues",
      "Soil consolidation",
      "Poor compaction",
      "Groundwater fluctuations"
    ],
    "focusAreas": [
      "Foundation interface",
      "Soil interaction & bearing support",
      "Soil erosion / drainage",
      "Baseplate support & grout",
      "Grout interface",
      "Foundation footprint / global bearing area",
      "Bearing soil zones / load-support areas",
      "Subgrade support / compacted layers",
      "Groundwater table / saturated soil zones"
    ]
  },
  {
    "code": "GHK",
    "label": "GHK - General Housekeeping & Maintenance",
    "definition": "Missing components, poor maintenance, debris accumulation, trip hazards.",
    "descriptions": [
      "Poor maintenance (trip hazards)",
      "Trip hazards (damaged grating)",
      "Missing guardrails or covers",
      "Debris accumulation",
      "Rusted or unmaintained supports",
      "Missing braces or bolts",
      "Undetected degradation"
    ],
    "mechanisms": [
      "Poor inspection / maintenance",
      "Missing components",
      "Lack of cleaning",
      "Poor maintenance",
      "Lack of inspection"
    ],
    "focusAreas": [
      "Access systems"
    ]
  },
  {
    "code": "MSI",
    "label": "MSI - Modification & Structural Integrity",
    "definition": "Unauthorized modification, addition of load without design review.",
    "descriptions": [
      "Unauthorized modification",
      "Poor maintenance / missing components",
      "Improper removal of structural elements",
      "Overloading of platforms or beams",
      "Altered supports without design review",
      "Misaligned or undersized supports"
    ],
    "mechanisms": [
      "Unauthorized modification",
      "Addition without design review",
      "Improper installation"
    ],
    "focusAreas": [
      "Structural modification control",
      "Maintenance condition"
    ]
  },
  {
    "code": "THR",
    "label": "THR - Fire & Thermal Damage",
    "definition": "Fire exposure, thermal cycling, thermal shock.",
    "descriptions": [
      "Fire damage",
      "Loss of strength in steel members",
      "Cracking in concrete surfaces",
      "Weakening of structural steel",
      "Distortion of structures"
    ],
    "mechanisms": [
      "Fire exposure",
      "Thermal shock",
      "Thermal expansion stress"
    ],
    "focusAreas": [
      "Fire exposure / thermal effects"
    ]
  },
  {
    "code": "SIE",
    "label": "SIE - Soil Instability & Erosion",
    "definition": "Soil erosion, washed-out backfill, voids from poor drainage or water infiltration.",
    "descriptions": [
      "Voids under foundation",
      "Washed-out soil",
      "Undermining of foundation",
      "Horizontal displacement of foundation"
    ],
    "mechanisms": [
      "Soil erosion / loss of support material",
      "Poor drainage",
      "Water infiltration",
      "Lateral soil movement"
    ],
    "focusAreas": [
      "Drainage paths",
      "Perimeter zones",
      "Drainage interface / water ingress zones"
    ]
  },
  {
    "code": "FH",
    "label": "FH - Frost Heave",
    "definition": "Ground movement (upward heave, cracking) from freeze-thaw cycling in frost-susceptible soils.",
    "descriptions": [
      "Upward movement",
      "Cracking and lifting"
    ],
    "mechanisms": [
      "Freeze-thaw cycles"
    ],
    "focusAreas": [
      "Shallow foundations",
      "Frost-susceptible soils"
    ]
  },
  {
    "code": "BCF",
    "label": "BCF - Bearing Capacity Failure",
    "definition": "Sudden or local settlement/collapse from inadequate soil bearing capacity.",
    "descriptions": [
      "Sudden settlement",
      "Local collapse",
      "Local bearing failure"
    ],
    "mechanisms": [
      "Weak bearing soil layer",
      "Overloading"
    ],
    "focusAreas": [
      "Load transfer zones / foundation-soil interface",
      "Load concentration zones / high stress areas"
    ]
  },
  {
    "code": "PF",
    "label": "PF - Pile Foundations",
    "definition": "Pile misalignment, breakage, or structural defects in deep foundation elements.",
    "descriptions": [
      "Inclined piles",
      "Broken piles",
      "Pile cracking / structural failure"
    ],
    "mechanisms": [
      "Misalignment",
      "Insufficient penetration",
      "Structural defects (pile integrity issues)"
    ],
    "focusAreas": [
      "Pile shaft",
      "Toe / bearing layer",
      "Pile body integrity / structural continuity"
    ]
  }
];

export const COMPONENT_TYPES: ComponentType[] = [
  {
    "name": "Roofing",
    "subComponents": [
      "Membrane / metal roof"
    ]
  },
  {
    "name": "Building Structure",
    "subComponents": []
  },
  {
    "name": "Storage Tank",
    "subComponents": []
  },
  {
    "name": "Floor Plate",
    "subComponents": []
  },
  {
    "name": "Grating",
    "subComponents": [
      "Steel grating"
    ]
  },
  {
    "name": "Concrete Floor",
    "subComponents": [
      "Slab-on-grade"
    ]
  },
  {
    "name": "Foundation Pier",
    "subComponents": []
  },
  {
    "name": "Access Ladder",
    "subComponents": [
      "Fixed ladder"
    ]
  },
  {
    "name": "Confined Space",
    "subComponents": []
  },
  {
    "name": "Column",
    "subComponents": [
      "Steel / concrete"
    ]
  },
  {
    "name": "Stairway",
    "subComponents": [
      "Steel stairs"
    ]
  },
  {
    "name": "Cable Tray",
    "subComponents": []
  },
  {
    "name": "Platform",
    "subComponents": [
      "Steel grating"
    ]
  },
  {
    "name": "Catwalks&Walkways",
    "subComponents": [
      "Steel grating"
    ]
  },
  {
    "name": "Handrails & Guardrails",
    "subComponents": [
      "Steel"
    ]
  },
  {
    "name": "Fixed Ladders & Cages",
    "subComponents": [
      "Fixed ladder"
    ]
  },
  {
    "name": "Wall Cladding",
    "subComponents": [
      "Metal / panel"
    ]
  },
  {
    "name": "Cable Tray Support",
    "subComponents": [
      "Steel frame"
    ]
  },
  {
    "name": "Pipe Support",
    "subComponents": [
      "Spring / rigid"
    ]
  },
  {
    "name": "Pump Support",
    "subComponents": [
      "Grouted steel base"
    ]
  },
  {
    "name": "Beams",
    "subComponents": [
      "Steel"
    ]
  },
  {
    "name": "Bracing",
    "subComponents": []
  },
  {
    "name": "Roof Mounted Unit",
    "subComponents": []
  },
  {
    "name": "Clarifier Tank",
    "subComponents": []
  },
  {
    "name": "Lime Silo",
    "subComponents": []
  },
  {
    "name": "Others",
    "subComponents": []
  }
];

// GENERATED from Nerizon_Structural_Integrity_Assessment_NALA.xlsx ("Details" sheet).
// Regenerate with scripts/generate-form-options.py rather than editing by hand.
//
// These are FLAT option lists — the sheet's columns are jagged, so row position
// carries no linkage between columns. Site→Parent Asset linkage comes from the
// Asset Registry / assets cache. The one meaningful row pairing is Priority↔Condition.

export interface PriorityCondition {
  priority: string;
  condition: string;
}

export const FORM_OPTIONS = {
  sites: ["Blackbird Mine", "Brenda Mine", "Bell Mine", "Grey Eagle Mine", "Geco/Wilroy Mine", "Heath Steele Mine", "Mattabi Mine", "Matagami Mine", "Brunswick Mine", "Montcalm Mine"],
  parentAssets: ["Blower Building", "B-Mine Pump House", "Water Treatment Plant", "Shop/Storage Building", "Buffer Pond Pump House", "Fresh Water Pump House", "Chandlers Pump House", "Chandlers Seepage Pump House", "Portal Pump House", "Stratmat Pump House", "Mosquito Ditch Pump House", "Reactor Tank", "LSTR Pump House", "Administrative Building", "Warehouse", "Flume House", "LDS Pond", "Sludge Pumphouse"],
  categories: ["Building Envelope", "Structural Support", "Foundations & Geotechnical", "Process Equipment", "Others"],
  components: ["Roofing", "Building Structure", "Storage Tank", "Floor Plate", "Grating", "Concrete floors / slabs", "Foundation Pier", "Access Ladder", "Confined Space", "Column", "Stairway", "Cable Tray", "Platform", "Catwalks&Walkways", "Handrails & Guardrails", "Fixed Ladders & Cages", "Wall Cladding", "Cable Tray Support", "Pipe Support", "Pump Support", "Beams / framing", "Bracing", "Roof Mounted Unit", "Clarifier Tank", "Lime Silo", "Structural columns (building)", "Others"],
  subComponents: ["Membrane / metal roof", "Metal / panel", "Slab-on-grade", "Steel / concrete", "Steel", "Steel grating", "Steel stairs", "Fixed ladder", "Grouted steel base", "Concrete ringwall", "Others"],
  locationDescriptions: ["British Colombia", "New Brunswick", "Ontario", "Quebec"],
  deficiencyCategories: ["CML - Corrosion & Material Loss", "CND - Concrete Deterioration", "CFI - Connection & Joint Failures", "CRK - Cracking Mechanisms", "DFI - Deformation & Mechanical Damage", "EWF - Envelope Failure", "ENV - Environmental & External Damage", "FDS - Foundation & Settlement", "GHK - General Housekeeping & Maintenance", "MSI - Modification & Structural Integrity", "THR - Fire & Thermal Damage", "SIE - Soil Instability & Erosion", "FH - Frost Heave", "BCF - Bearing Capacity Failure", "PF - Pile Foundations"],
  deficiencyDescriptions: ["Corrosion - Internal", "Corrosion - External", "Loose / Missing Fittings", "Fire Damage", "Vehicle / Impact Damage", "Deterioration / Wear", "Environmental Damage", "Poor Maintenance", "Unauthorized Modification", "Subsidence / Erosion", "Pest Damage", "Coating Failure", "Cracking", "Spalling", "Deformation / Distortion", "Section Loss", "Settlement / Movement", "Water Ingress", "Loose fasteners", "Missing components", "Stability", "Exposed reinforcement", "Missing bolts or welds", "Sagging", "Signs of overstress", "Missing or deteriorated insulation", "Steel deck deterioration", "Delamination", "Missing grout under baseplates/columns"],
  priorityConditions: [{"priority": "P1", "condition": "Critical Condition - Immediate action required"}, {"priority": "P2", "condition": "Poor Condition - Repair actions needed within 12 months"}, {"priority": "P3", "condition": "Bad Condition - Repairs needed within 24 to 36 months"}, {"priority": "P4", "condition": "Fair Condition - Monitor before next scheduled inspection"}, {"priority": "P5", "condition": "Good Condition - No repairs required"}],
} as const;

export function conditionFor(priority: string): string {
  return FORM_OPTIONS.priorityConditions.find((p) => p.priority === priority)?.condition ?? '';
}

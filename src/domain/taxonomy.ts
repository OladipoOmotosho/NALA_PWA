// GENERATED from Nerizon_Structural_Integrity_Assessment_NALA.xlsx (Taxonomy sheet, 105 rows).
// Regenerate with scripts/generate-taxonomy.py rather than editing by hand.
// Hierarchy: Category > Equipment Type > Component > Subcomponent > { focusArea, mechanisms }.

export interface TaxonomyRow {
  category: string;
  equipmentType: string;
  component: string;
  subcomponent: string;
  focusArea: string;
  mechanisms: string[];
}

export const TAXONOMY: TaxonomyRow[] = [
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Influent Screen / Bar Rack",
    "component": "Screen Assembly",
    "subcomponent": "Bar Rack / Mesh Panel",
    "focusArea": "Section loss, blinding/plugging, distortion of bars from grit and debris loading",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Influent Screen / Bar Rack",
    "component": "Screen Assembly",
    "subcomponent": "Guide Rails / Frame",
    "focusArea": "Frame corrosion, guide rail wear and misalignment affecting screen travel",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Influent Screen / Bar Rack",
    "component": "Support Structure",
    "subcomponent": "Anchor Bolts / Base",
    "focusArea": "Anchorage integrity and foundation interface condition",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Equalization / Sump Tank",
    "component": "Tank Shell / Wall",
    "subcomponent": "Wall Plate (steel) or Concrete Wall Panel",
    "focusArea": "Wall thinning/corrosion (steel) or cracking, spalling, sulfate attack (concrete) from raw mine-impacted water",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CND - Concrete Deterioration"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Equalization / Sump Tank",
    "component": "Tank Shell / Wall",
    "subcomponent": "Wall-to-Floor Joint / Waterstop",
    "focusArea": "Joint leakage, waterstop failure, moisture migration",
    "mechanisms": [
      "EWF - Envelope Failure",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Equalization / Sump Tank",
    "component": "Floor / Sump",
    "subcomponent": "Base Slab",
    "focusArea": "Grit/silt abrasion, cracking, differential settlement",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "CND - Concrete Deterioration",
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Equalization / Sump Tank",
    "component": "Access",
    "subcomponent": "Manway / Hatch, Platform",
    "focusArea": "Corrosion of fittings, seal condition, safe access integrity",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "EWF - Envelope Failure"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Rapid Mix / Reaction Tank",
    "component": "Tank Shell",
    "subcomponent": "Wall / Internal Lining",
    "focusArea": "Chemical and abrasive attack from lime slurry, lining breakdown exposing substrate",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Rapid Mix / Reaction Tank",
    "component": "Agitator / Mixer",
    "subcomponent": "Shaft, Impeller, Mounting",
    "focusArea": "Fatigue cracking, erosion of wetted parts, mounting bolt integrity",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "FLW - Flow-Induced Damage",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Rapid Mix / Reaction Tank",
    "component": "Support / Foundation",
    "subcomponent": "Baseplate, Anchor Bolts",
    "focusArea": "Vibration-induced loosening, grout condition under mixer drive",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Lime Reactor / HDS Reaction Tank",
    "component": "Tank Shell",
    "subcomponent": "Wall Plate, Coating/Lining",
    "focusArea": "Abrasive and corrosive wear from lime and recycled high-density sludge, coating breakdown",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Lime Reactor / HDS Reaction Tank",
    "component": "Internals",
    "subcomponent": "Agitator/Impeller, Aeration Diffusers, Baffles",
    "focusArea": "Erosion of agitator and diffusers, fatigue cracking, attachment weld condition",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "CRK - Cracking Mechanisms",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Lime Reactor / HDS Reaction Tank",
    "component": "Support / Foundation",
    "subcomponent": "Skirt/Legs, Anchor Bolts, Foundation",
    "focusArea": "Load path integrity, settlement, anchorage under continuous agitation loading",
    "mechanisms": [
      "FDS - Foundation & Settlement",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Reactivator Clarifier / Thickener",
    "component": "Tank Shell / Walls",
    "subcomponent": "Wall Plate (steel) or Concrete Wall",
    "focusArea": "Wall thinning/corrosion or sulfate attack from sustained contact with mine-impacted water and sludge",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CND - Concrete Deterioration"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Reactivator Clarifier / Thickener",
    "component": "Drive Mechanism",
    "subcomponent": "Center Column, Bridge/Walkway, Drive Support",
    "focusArea": "Structural integrity of center column and bridge, corrosion, drive misalignment",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "DFI - Deformation & Mechanical Damage",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Reactivator Clarifier / Thickener",
    "component": "Rake / Scraper Mechanism",
    "subcomponent": "Rake Arms, Scraper Blades",
    "focusArea": "Abrasive wear from settled/thickened sludge, bent or corroded arms, torque overload",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Reactivator Clarifier / Thickener",
    "component": "Launder & Weir",
    "subcomponent": "Overflow Launder, Weir Plates",
    "focusArea": "Cracking/spalling (concrete) or corrosion (steel), level control accuracy",
    "mechanisms": [
      "CND - Concrete Deterioration",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Reactivator Clarifier / Thickener",
    "component": "Underflow System",
    "subcomponent": "Cone/Hopper, Underflow Piping",
    "focusArea": "Abrasion from high-density sludge underflow, plugging, structural integrity of cone",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "OPR - Operational & Process-Related Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Lime Silo & Slaking System",
    "component": "Silo",
    "subcomponent": "Shell / Walls",
    "focusArea": "Internal abrasion from lime, external atmospheric corrosion, coating condition",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Lime Silo & Slaking System",
    "component": "Silo",
    "subcomponent": "Support Legs / Skirt",
    "focusArea": "Buckling, corrosion, anchorage of support structure",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "CML - Corrosion & Material Loss",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Lime Silo & Slaking System",
    "component": "Silo",
    "subcomponent": "Discharge Cone / Feeder",
    "focusArea": "Wear/abrasion, arching/blockage, structural integrity of cone under cyclic loading",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "OPR - Operational & Process-Related Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Lime Silo & Slaking System",
    "component": "Slaker Unit",
    "subcomponent": "Slaking Chamber, Agitator",
    "focusArea": "Thermal and chemical attack from exothermic slaking reaction, erosion of wetted parts",
    "mechanisms": [
      "THR - Fire & Thermal Damage",
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Chemical Storage Tank (polymer/coagulant/caustic/acid)",
    "component": "Tank Shell",
    "subcomponent": "FRP / Steel / Poly Wall",
    "focusArea": "Chemical compatibility, UV degradation (FRP), wall thinning",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "ENV - Environmental & External Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Chemical Storage Tank (polymer/coagulant/caustic/acid)",
    "component": "Secondary Containment",
    "subcomponent": "Containment Bund/Berm, Liner",
    "focusArea": "Containment integrity, concrete cracking, liner degradation from chemical exposure",
    "mechanisms": [
      "CND - Concrete Deterioration",
      "EWF - Envelope Failure"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Chemical Storage Tank (polymer/coagulant/caustic/acid)",
    "component": "Nozzles / Venting",
    "subcomponent": "Fill/Vent Nozzles, Overflow",
    "focusArea": "Leak points, corrosion at connections, vent blockage",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Chemical Dosing Skid / Feed Pumps",
    "component": "Skid Frame",
    "subcomponent": "Base Frame, Anchor Points",
    "focusArea": "Corrosion from chemical exposure/spillage, frame structural integrity",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Chemical Dosing Skid / Feed Pumps",
    "component": "Metering Pump",
    "subcomponent": "Pump Head, Diaphragm/Seal",
    "focusArea": "Leakage, chemical attack on seals and diaphragms",
    "mechanisms": [
      "LOC - Leakage / Loss of Containment",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Chemical Dosing Skid / Feed Pumps",
    "component": "Piping / Tubing",
    "subcomponent": "Chemical Feed Lines, Fittings",
    "focusArea": "Chemical corrosion, joint leakage at fittings",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Sludge Thickener",
    "component": "Tank Shell",
    "subcomponent": "Wall Plate / Concrete Wall",
    "focusArea": "Abrasive and corrosive wear from thickened sludge",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Sludge Thickener",
    "component": "Rake Mechanism",
    "subcomponent": "Rake Arms, Drive Unit",
    "focusArea": "Wear from high-solids sludge, torque overload, drive support condition",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Sludge Dewatering (Filter Press / Belt Press / Centrifuge)",
    "component": "Frame / Skid",
    "subcomponent": "Main Frame, Hydraulic Cylinder Mounts",
    "focusArea": "Structural fatigue from cyclic press operation, corrosion of frame members",
    "mechanisms": [
      "CRK - Cracking Mechanisms",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Sludge Dewatering (Filter Press / Belt Press / Centrifuge)",
    "component": "Filter Media",
    "subcomponent": "Filter Plates / Belts",
    "focusArea": "Wear, chemical attack, tearing of filter media",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Sludge Dewatering (Filter Press / Belt Press / Centrifuge)",
    "component": "Feed System",
    "subcomponent": "Feed Pump, Piping",
    "focusArea": "Abrasion from thickened sludge feed, plugging",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "OPR - Operational & Process-Related Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Media Filter (Sand / Multimedia)",
    "component": "Filter Vessel / Basin",
    "subcomponent": "Shell (pressure) or Concrete Basin (gravity)",
    "focusArea": "Corrosion (steel) or cracking (concrete), coating/lining condition",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CND - Concrete Deterioration"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Media Filter (Sand / Multimedia)",
    "component": "Underdrain System",
    "subcomponent": "Nozzles/Laterals, Support Plate",
    "focusArea": "Clogging, structural support of media bed, corrosion of underdrain components",
    "mechanisms": [
      "OPR - Operational & Process-Related Damage",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Media Filter (Sand / Multimedia)",
    "component": "Backwash System",
    "subcomponent": "Backwash Piping, Air Scour",
    "focusArea": "Erosion at high-velocity backwash flow, joint integrity under pressure surges",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Membrane System (RO/UF)",
    "component": "Skid Frame",
    "subcomponent": "Frame, Pressure Vessel Racking",
    "focusArea": "Structural support of pressure vessels, vibration-induced loosening",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Membrane System (RO/UF)",
    "component": "Pressure Vessels / Housings",
    "subcomponent": "Membrane Housing, End Caps",
    "focusArea": "Pressure boundary integrity, seal leakage at end caps",
    "mechanisms": [
      "LOC - Leakage / Loss of Containment",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Membrane System (RO/UF)",
    "component": "Piping Manifolds",
    "subcomponent": "Feed / Permeate / Concentrate Headers",
    "focusArea": "High-pressure joint integrity, concentrate-stream corrosion (elevated salinity/metals)",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Neutralization Tank",
    "component": "Tank Shell",
    "subcomponent": "Wall / Lining",
    "focusArea": "Chemical attack from pH swings, lining integrity",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "EWF - Envelope Failure"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Neutralization Tank",
    "component": "Mixer / Agitator",
    "subcomponent": "Shaft, pH Probe Mount",
    "focusArea": "Corrosion, fatigue cracking, instrumentation mounting integrity",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CRK - Cracking Mechanisms"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Pumps (Transfer / Recycle / Sludge / Feed / Effluent)",
    "component": "Casing / Volute",
    "subcomponent": "Casing, Wear Rings",
    "focusArea": "Erosion/abrasion from slurry, corrosion of casing",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Pumps (Transfer / Recycle / Sludge / Feed / Effluent)",
    "component": "Baseplate & Foundation",
    "subcomponent": "Baseplate, Grout, Anchor Bolts",
    "focusArea": "Grout condition, anchorage integrity, alignment",
    "mechanisms": [
      "FDS - Foundation & Settlement",
      "CFI - Connection & Joint Failures",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Pumps (Transfer / Recycle / Sludge / Feed / Effluent)",
    "component": "Seal / Packing",
    "subcomponent": "Mechanical Seal, Packing Gland",
    "focusArea": "Leakage, seal wear from abrasive slurry service",
    "mechanisms": [
      "LOC - Leakage / Loss of Containment"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Pumps (Transfer / Recycle / Sludge / Feed / Effluent)",
    "component": "Bearing Housing",
    "subcomponent": "Bearings, Coupling Guard",
    "focusArea": "Vibration, overheating, guarding integrity",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "GHK - General Housekeeping & Maintenance"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Piping Systems (Process / Chemical / Slurry-Sludge Lines)",
    "component": "Straight Runs",
    "subcomponent": "Carbon Steel / HDPE / Lined Pipe",
    "focusArea": "Wall thinning, internal lining wear (slurry lines), external atmospheric corrosion",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Piping Systems (Process / Chemical / Slurry-Sludge Lines)",
    "component": "Fittings / Elbows",
    "subcomponent": "Elbows, Reducers, Wear-Back Plates",
    "focusArea": "Erosion at direction changes carrying abrasive slurry, wear-back condition",
    "mechanisms": [
      "FLW - Flow-Induced Damage"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Piping Systems (Process / Chemical / Slurry-Sludge Lines)",
    "component": "Joints / Connections",
    "subcomponent": "Flanges, Victaulic/Mechanical Couplings",
    "focusArea": "Leakage, bolt and gasket condition",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "LOC - Leakage / Loss of Containment"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Piping Systems (Process / Chemical / Slurry-Sludge Lines)",
    "component": "Supports / Hangers",
    "subcomponent": "Pipe Shoes, Hangers, Guides",
    "focusArea": "Overload, corrosion at contact points, misalignment",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Storage Tank (Treated Water / Effluent)",
    "component": "Shell",
    "subcomponent": "Shell Courses",
    "focusArea": "Wall thinning, coating condition",
    "mechanisms": [
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Storage Tank (Treated Water / Effluent)",
    "component": "Roof",
    "subcomponent": "Roof Structure, Roof Seals",
    "focusArea": "Deformation, water ingress at seals",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "EWF - Envelope Failure"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Storage Tank (Treated Water / Effluent)",
    "component": "Bottom / Foundation Interface",
    "subcomponent": "Bottom Plate, Annular Ring, Ring-wall",
    "focusArea": "Underside corrosion, settlement at ring-wall interface",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Storage Tank (Treated Water / Effluent)",
    "component": "Nozzles",
    "subcomponent": "Inlet/Outlet, Overflow",
    "focusArea": "Leakage, cracking at connections",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Effluent Discharge Structure / Outfall",
    "component": "Discharge Structure",
    "subcomponent": "Headwall, Discharge Pipe",
    "focusArea": "Erosion, structural cracking, scour at point of discharge",
    "mechanisms": [
      "FLW - Flow-Induced Damage",
      "CND - Concrete Deterioration"
    ]
  },
  {
    "category": "Process Equipment (Mechanical)",
    "equipmentType": "Effluent Discharge Structure / Outfall",
    "component": "Erosion Protection",
    "subcomponent": "Riprap / Energy Dissipator",
    "focusArea": "Scour, displacement, undermining of receiving channel bank",
    "mechanisms": [
      "SIE - Soil Instability & Erosion",
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Tank / Basin Foundation Interface",
    "component": "Concrete Ringwall / Basin Wall",
    "subcomponent": "Ringwall, Bearing Pad & Grout",
    "focusArea": "Settlement/differential settlement, load distribution, concrete integrity",
    "mechanisms": [
      "FDS - Foundation & Settlement",
      "CND - Concrete Deterioration"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Tank / Basin Foundation Interface",
    "component": "Anchor Chairs",
    "subcomponent": "Anchor Chair, Base Plate",
    "focusArea": "Anchorage corrosion, cracking at anchor chair",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Clarifier / Thickener Support",
    "component": "Center Column Foundation",
    "subcomponent": "Foundation Pedestal",
    "focusArea": "Bearing support, settlement beneath rotating drive column",
    "mechanisms": [
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Clarifier / Thickener Support",
    "component": "Bridge / Walkway Support",
    "subcomponent": "Support Beams, Bracing",
    "focusArea": "Alignment, corrosion, structural capacity for drive bridge and access walkway",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pump Bases / Skids",
    "component": "Grouted Steel Base",
    "subcomponent": "Baseplate, Grout",
    "focusArea": "Grout condition and load transfer under vibrating equipment",
    "mechanisms": [
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pump Bases / Skids",
    "component": "Anchorage",
    "subcomponent": "Anchor Bolts",
    "focusArea": "Anchor bolt corrosion, looseness, failure",
    "mechanisms": [
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pump Bases / Skids",
    "component": "Skid Frame",
    "subcomponent": "Frame Members",
    "focusArea": "Distortion from vibration or impact",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Silo Support Structure",
    "component": "Support Legs / Skirt",
    "subcomponent": "Legs, Skirt, Bracing",
    "focusArea": "Buckling, corrosion, lateral stability under wind/seismic and full-silo loading",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pipe Supports / Hangers",
    "component": "Shoe / Saddle",
    "subcomponent": "Pipe Shoe, Saddle",
    "focusArea": "Corrosion at pipe-to-support contact points",
    "mechanisms": [
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pipe Supports / Hangers",
    "component": "U-Bolts & Clamps",
    "subcomponent": "Fasteners",
    "focusArea": "Fixation adequacy, loose or missing clamps on vibrating/slurry lines",
    "mechanisms": [
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pipe Supports / Hangers",
    "component": "Guides & Anchors",
    "subcomponent": "Guide Assembly, Anchor Point",
    "focusArea": "Movement control, seized or broken guides restricting thermal/mechanical movement",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pipe Racks (process / chemical / slurry lines)",
    "component": "Transverse Beams",
    "subcomponent": "Beams",
    "focusArea": "Corrosion, deflection of load-bearing beams",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pipe Racks (process / chemical / slurry lines)",
    "component": "Bracing",
    "subcomponent": "Bracing Members",
    "focusArea": "Lateral stability, loose or disconnected bracing",
    "mechanisms": [
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Pipe Racks (process / chemical / slurry lines)",
    "component": "Base Plates",
    "subcomponent": "Base Plate, Grout",
    "focusArea": "Anchorage, grout loss/settlement at base",
    "mechanisms": [
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Equipment Frames (mixers, agitators, dosing skids)",
    "component": "Cross Members",
    "subcomponent": "Frame Members",
    "focusArea": "Distortion under dynamic/vibration loading",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Equipment Frames (mixers, agitators, dosing skids)",
    "component": "Gusset Plates",
    "subcomponent": "Welded Connections",
    "focusArea": "Fatigue cracking at gusset welds",
    "mechanisms": [
      "CRK - Cracking Mechanisms"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Anchor Bolts / Baseplates (general)",
    "component": "Grout Bed",
    "subcomponent": "Grout",
    "focusArea": "Load transfer condition, cracking or missing grout",
    "mechanisms": [
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Anchor Bolts / Baseplates (general)",
    "component": "Anchor Plate",
    "subcomponent": "Plate, Levelling Nuts",
    "focusArea": "Corrosion, alignment, seized levelling nuts",
    "mechanisms": [
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Cable Tray Supports",
    "component": "Cantilever Arms / Trapeze Hangers",
    "subcomponent": "Support Arms, Hangers",
    "focusArea": "Corrosion, coating failure, loose or corroded hanger rods",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Structural Steel Supporting Vessels / Tanks",
    "component": "Saddle Supports",
    "subcomponent": "Saddle",
    "focusArea": "Distortion or corrosion at saddle support points",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Structural Steel Supporting Vessels / Tanks",
    "component": "Skirt / Legs",
    "subcomponent": "Skirt, Legs",
    "focusArea": "Corrosion, cracking at skirt or legs supporting process vessels",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CRK - Cracking Mechanisms"
    ]
  },
  {
    "category": "Structural Support",
    "equipmentType": "Structural Steel Supporting Vessels / Tanks",
    "component": "Welded Connections",
    "subcomponent": "Critical Welds",
    "focusArea": "Cracking at welded connections under sustained/cyclic loading",
    "mechanisms": [
      "CRK - Cracking Mechanisms"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Shallow Foundations",
    "component": "Pad / Spread Footings",
    "subcomponent": "Footing",
    "focusArea": "Uneven or differential settlement, cracking",
    "mechanisms": [
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Shallow Foundations",
    "component": "Strip Footings, Grade Beams",
    "subcomponent": "Footing / Beam",
    "focusArea": "Cracking of foundation elements, load distribution",
    "mechanisms": [
      "CRK - Cracking Mechanisms",
      "FDS - Foundation & Settlement"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Slabs-on-Grade",
    "component": "Reinforced Slab, Subgrade/Sub-base",
    "subcomponent": "Slab, Compacted Fill",
    "focusArea": "Tilting, loss of soil stiffness / bearing capacity, voids beneath slab",
    "mechanisms": [
      "FDS - Foundation & Settlement",
      "BCF - Bearing Capacity Failure"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Slabs-on-Grade",
    "component": "Control Joints, Vapour Barrier",
    "subcomponent": "Joint, Barrier",
    "focusArea": "Joint spalling/differential movement, moisture ingress",
    "mechanisms": [
      "CRK - Cracking Mechanisms",
      "SIE - Soil Instability & Erosion"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Soil Interaction Zones",
    "component": "Backfill / Surrounding Soil",
    "subcomponent": "Drainage Paths, Perimeter Zones",
    "focusArea": "Voids under foundation, washed-out soil, undermining",
    "mechanisms": [
      "SIE - Soil Instability & Erosion"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Soil Interaction Zones",
    "component": "Drainage Layer, Perimeter Grading",
    "subcomponent": "Drain, Grading",
    "focusArea": "Blocked or eroded drainage, negative grading causing ponding at foundations",
    "mechanisms": [
      "SIE - Soil Instability & Erosion"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Legacy Mine Ground Interface",
    "component": "Backfilled / Reclaimed Ground",
    "subcomponent": "Engineered Fill over Former Workings",
    "focusArea": "Long-term consolidation settlement of placed fill overlying disturbed mine ground",
    "mechanisms": [
      "FDS - Foundation & Settlement",
      "MSB - Mine Subsidence & Ground Instability"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Legacy Mine Ground Interface",
    "component": "Void / Subsidence Zones",
    "subcomponent": "Shallow Voids, Collapsed Workings",
    "focusArea": "Subsidence and void migration risk from collapse of underlying abandoned workings; sinkhole potential",
    "mechanisms": [
      "MSB - Mine Subsidence & Ground Instability",
      "BCF - Bearing Capacity Failure"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Legacy Mine Ground Interface",
    "component": "Old Mine Workings Below Grade",
    "subcomponent": "Shafts, Adits, Stopes (if mapped nearby)",
    "focusArea": "Proximity to unmapped or poorly documented workings; ongoing ground movement monitoring needs",
    "mechanisms": [
      "MSB - Mine Subsidence & Ground Instability"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Frost-Sensitive Soils (climate-dependent)",
    "component": "Shallow Foundations in Frost Zone",
    "subcomponent": "Frost-Susceptible Soil",
    "focusArea": "Upward movement, cracking and lifting from freeze-thaw cycling",
    "mechanisms": [
      "FH - Frost Heave"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Concrete Foundations",
    "component": "Footings / Pedestals, Pile Caps",
    "subcomponent": "Concrete Element",
    "focusArea": "Spalling, surface/structural cracking",
    "mechanisms": [
      "CND - Concrete Deterioration"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Concrete Foundations",
    "component": "Reinforcement / Rebar",
    "subcomponent": "Rebar",
    "focusArea": "Corrosion of reinforcement, especially where acidic/sulfate-bearing mine water can reach foundations",
    "mechanisms": [
      "CND - Concrete Deterioration"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Concrete Foundations",
    "component": "Waterproofing",
    "subcomponent": "Membrane / Coating",
    "focusArea": "Failed waterproofing, water/chemical ingress to foundation concrete",
    "mechanisms": [
      "SIE - Soil Instability & Erosion",
      "CND - Concrete Deterioration"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Bearing / Load Transfer Zones",
    "component": "Bearing Soils",
    "subcomponent": "Foundation-Soil Interface",
    "focusArea": "Sudden or differential settlement, local bearing failure under concentrated loads",
    "mechanisms": [
      "BCF - Bearing Capacity Failure"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Deep Foundations (where used)",
    "component": "Pile Foundations",
    "subcomponent": "Pile Shaft, Toe/Bearing Layer",
    "focusArea": "Inclined or broken piles, insufficient penetration to bearing layer",
    "mechanisms": [
      "PF - Pile Foundations"
    ]
  },
  {
    "category": "Foundations & Geotechnical",
    "equipmentType": "Deep Foundations (where used)",
    "component": "Pile-to-Cap Connection",
    "subcomponent": "Connection Detail",
    "focusArea": "Cracking or separation at pile-to-cap connection",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "PF - Pile Foundations"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Roofing Systems",
    "component": "Membrane / Metal Roof",
    "subcomponent": "Deck, Insulation, Flashing & Parapets",
    "focusArea": "Water ingress, corrosion of steel deck, sagging/deformation",
    "mechanisms": [
      "EWF - Envelope Failure",
      "CML - Corrosion & Material Loss",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Roofing Systems",
    "component": "Roof Drainage & Penetrations",
    "subcomponent": "Gutters, Drains, Skylights, Penetration Seals",
    "focusArea": "Blocked/corroded drains, ponding, failed penetration seals",
    "mechanisms": [
      "GHK - General Housekeeping & Maintenance",
      "EWF - Envelope Failure"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Wall Cladding",
    "component": "Metal / Insulated Panel",
    "subcomponent": "Panel, Sealants & Joints, Louvres/Vents",
    "focusArea": "Water ingress, panel delamination, corroded louvres, weather damage",
    "mechanisms": [
      "EWF - Envelope Failure",
      "ENV - Environmental & External Damage",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Concrete Floors / Slabs",
    "component": "Slab-on-Grade",
    "subcomponent": "Topping/Wearing Surface, Construction/Control Joints",
    "focusArea": "Cracking, spalling, chemical attack from spills of process chemicals",
    "mechanisms": [
      "CND - Concrete Deterioration",
      "CRK - Cracking Mechanisms"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Structural Columns (building)",
    "component": "Steel / Concrete Column",
    "subcomponent": "Base Plates & Anchor Bolts, Splices",
    "focusArea": "Corrosion of exposed steel, anchorage condition, misalignment",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CFI - Connection & Joint Failures",
      "DFI - Deformation & Mechanical Damage"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Beams / Framing",
    "component": "Steel Framing",
    "subcomponent": "Beam-to-Column Connections, Bracing, Purlins/Girts",
    "focusArea": "Fatigue or weld cracking, deflection/overstress, corrosion of secondary framing",
    "mechanisms": [
      "CRK - Cracking Mechanisms",
      "DFI - Deformation & Mechanical Damage",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Walkways / Platforms",
    "component": "Steel Grating / Checker Plate",
    "subcomponent": "Decking, Support Framing, Toe/Kick Plates",
    "focusArea": "Corrosion, trip hazards, deflection of supporting steel",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "GHK - General Housekeeping & Maintenance"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Stairways",
    "component": "Steel Stairs",
    "subcomponent": "Treads & Risers, Stringers, Landings",
    "focusArea": "Worn/loose treads, corrosion or cracking of stringers, deflection at landings",
    "mechanisms": [
      "GHK - General Housekeeping & Maintenance",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Access Ladders & Cages",
    "component": "Fixed Ladder",
    "subcomponent": "Rungs & Rails, Safety Cage, Ladder Anchors",
    "focusArea": "Corroded/bent/missing rungs, loose cage fixings and anchors",
    "mechanisms": [
      "CML - Corrosion & Material Loss",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Handrails / Guardrails",
    "component": "Steel Rail System",
    "subcomponent": "Top/Mid Rails, Posts & Bases, Fasteners & Welds",
    "focusArea": "Bent, loose or missing rails, corroded posts, cracked welds",
    "mechanisms": [
      "DFI - Deformation & Mechanical Damage",
      "CFI - Connection & Joint Failures"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "Grating Systems",
    "component": "Floor Grating",
    "subcomponent": "Grating Clips, Support Angles, Edge Banding",
    "focusArea": "Missing/loose clips, corroded support angles, damaged edge banding",
    "mechanisms": [
      "CFI - Connection & Joint Failures",
      "CML - Corrosion & Material Loss"
    ]
  },
  {
    "category": "Building Envelope",
    "equipmentType": "General / Envelope-Wide",
    "component": "All Building Elements",
    "subcomponent": "N/A",
    "focusArea": "Vehicle/equipment impact damage, environmental degradation, unauthorized modification, fire exposure",
    "mechanisms": [
      "ENV - Environmental & External Damage",
      "MSI - Modification & Structural Integrity",
      "THR - Fire & Thermal Damage"
    ]
  }
];

/**
 * Cascading queries over the Taxonomy hierarchy:
 * Category → Equipment Type → Component → Subcomponent → { focusArea, mechanisms }.
 * Every level's options are filtered by all selections above it; the full path
 * is unique (validated at generation time), so the leaf lookup is deterministic.
 */
import { TAXONOMY, type TaxonomyRow } from './taxonomy';

function unique(values: string[]): string[] {
  return [...new Set(values)]; // preserves first-appearance (workbook) order
}

export function taxonomyCategories(): string[] {
  return unique(TAXONOMY.map((r) => r.category));
}

export function equipmentTypesFor(category: string): string[] {
  return unique(TAXONOMY.filter((r) => r.category === category).map((r) => r.equipmentType));
}

export function componentsFor(category: string, equipmentType: string): string[] {
  return unique(
    TAXONOMY.filter((r) => r.category === category && r.equipmentType === equipmentType).map((r) => r.component),
  );
}

export function subcomponentsFor(category: string, equipmentType: string, component: string): string[] {
  return unique(
    TAXONOMY.filter(
      (r) => r.category === category && r.equipmentType === equipmentType && r.component === component,
    ).map((r) => r.subcomponent),
  );
}

/** The leaf row for a fully-selected path; undefined until all four levels are chosen validly. */
export function taxonomyLeaf(
  category: string,
  equipmentType: string,
  component: string,
  subcomponent: string,
): TaxonomyRow | undefined {
  return TAXONOMY.find(
    (r) =>
      r.category === category &&
      r.equipmentType === equipmentType &&
      r.component === component &&
      r.subcomponent === subcomponent,
  );
}

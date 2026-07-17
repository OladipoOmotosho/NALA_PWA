import { describe, expect, it } from 'vitest';
import { FORM_OPTIONS, conditionFor } from './formOptions';
import { PRIORITY_DESCRIPTIONS, SITES, DEFICIENCY_CATEGORIES } from './lookups';
import { taxonomyCategories } from './taxonomyQuery';

describe('form options (generated from the workbook Details sheet)', () => {
  it('has the screenshot-verified list sizes', () => {
    expect(FORM_OPTIONS.sites.length).toBe(10);
    expect(FORM_OPTIONS.parentAssets.length).toBe(18);
    expect(FORM_OPTIONS.categories.length).toBe(5);
    expect(FORM_OPTIONS.components.length).toBe(27);
    expect(FORM_OPTIONS.subComponents.length).toBe(11);
    expect(FORM_OPTIONS.locationDescriptions).toEqual(['British Colombia', 'New Brunswick', 'Ontario', 'Quebec']);
    expect(FORM_OPTIONS.deficiencyCategories.length).toBe(15);
    expect(FORM_OPTIONS.deficiencyDescriptions.length).toBe(29);
  });

  it('spot-checks screenshot rows', () => {
    expect(FORM_OPTIONS.sites[0]).toBe('Blackbird Mine');
    expect(FORM_OPTIONS.parentAssets).toContain('Chandlers Seepage Pump House');
    expect(FORM_OPTIONS.parentAssets).toContain('Sludge Pumphouse');
    expect(FORM_OPTIONS.categories).toEqual([
      'Building Envelope',
      'Structural Support',
      'Foundations & Geotechnical',
      'Process Equipment',
      'Others',
    ]);
    expect(FORM_OPTIONS.components).toContain('Structural columns (building)');
    expect(FORM_OPTIONS.components).toContain('Others');
    expect(FORM_OPTIONS.deficiencyDescriptions).toContain('Missing grout under baseplates/columns');
  });

  it('pairs each priority with its condition (row-aligned P1..P5)', () => {
    expect(FORM_OPTIONS.priorityConditions.map((p) => p.priority)).toEqual(['P1', 'P2', 'P3', 'P4', 'P5']);
    expect(conditionFor('P1')).toBe('Critical Condition - Immediate action required');
    expect(conditionFor('P5')).toBe('Good Condition - No repairs required');
    expect(conditionFor('P9')).toBe('');
  });
});

describe('cross-domain consistency', () => {
  it('matches the priority↔condition mapping already used for derivation', () => {
    for (const { priority, condition } of FORM_OPTIONS.priorityConditions) {
      expect(PRIORITY_DESCRIPTIONS[priority]).toBe(condition);
    }
  });

  it('site list matches the lookups SiteList', () => {
    expect([...FORM_OPTIONS.sites]).toEqual(SITES);
  });

  it('deficiency category labels match the 15-code picklist', () => {
    expect([...FORM_OPTIONS.deficiencyCategories]).toEqual(DEFICIENCY_CATEGORIES.map((c) => c.label));
  });

  it('taxonomy categories map onto Details categories (naming drift documented)', () => {
    // Details says 'Process Equipment'; Taxonomy says 'Process Equipment (Mechanical)'.
    const details = FORM_OPTIONS.categories;
    const taxonomy = taxonomyCategories();
    expect(details).toContain('Building Envelope');
    expect(taxonomy).toContain('Building Envelope');
    expect(details).toContain('Process Equipment');
    expect(taxonomy).toContain('Process Equipment (Mechanical)');
  });
});

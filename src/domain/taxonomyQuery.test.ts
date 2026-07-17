import { describe, expect, it } from 'vitest';
import { TAXONOMY } from './taxonomy';
import {
  componentsFor,
  equipmentTypesFor,
  subcomponentsFor,
  taxonomyCategories,
  taxonomyLeaf,
} from './taxonomyQuery';

describe('taxonomy data (generated from the workbook Taxonomy sheet)', () => {
  it('has the full 105 rows with the workbook category distribution', () => {
    expect(TAXONOMY.length).toBe(105);
    const count = (c: string) => TAXONOMY.filter((r) => r.category === c).length;
    expect(count('Process Equipment (Mechanical)')).toBe(55);
    expect(count('Structural Support')).toBe(22);
    expect(count('Foundations & Geotechnical')).toBe(16);
    expect(count('Building Envelope')).toBe(12);
  });

  it('every full path is unique (cascade cannot be ambiguous)', () => {
    const paths = TAXONOMY.map((r) => `${r.category}|${r.equipmentType}|${r.component}|${r.subcomponent}`);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('every row has a focus area and at least one mechanism', () => {
    for (const r of TAXONOMY) {
      expect(r.focusArea.length).toBeGreaterThan(0);
      expect(r.mechanisms.length).toBeGreaterThan(0);
    }
  });
});

describe('cascading queries', () => {
  it('lists the 4 categories in workbook order', () => {
    expect(taxonomyCategories()).toEqual([
      'Process Equipment (Mechanical)',
      'Structural Support',
      'Foundations & Geotechnical',
      'Building Envelope',
    ]);
  });

  it('each level is filtered by all previous selections (the user example path)', () => {
    const cat = 'Process Equipment (Mechanical)';
    const equips = equipmentTypesFor(cat);
    expect(equips[0]).toBe('Influent Screen / Bar Rack');
    expect(equips).not.toContain('Shallow Foundations'); // belongs to another category

    const comps = componentsFor(cat, 'Influent Screen / Bar Rack');
    expect(comps).toEqual(['Screen Assembly', 'Support Structure']);

    const subs = subcomponentsFor(cat, 'Influent Screen / Bar Rack', 'Screen Assembly');
    expect(subs).toEqual(['Bar Rack / Mesh Panel', 'Guide Rails / Frame']);
  });

  it('deduplicates repeated names at each level', () => {
    // 'Equalization / Sump Tank' spans 4 rows but appears once
    const equips = equipmentTypesFor('Process Equipment (Mechanical)');
    expect(equips.filter((e) => e === 'Equalization / Sump Tank').length).toBe(1);
  });

  it('the leaf carries focus area and split mechanisms', () => {
    const leaf = taxonomyLeaf(
      'Process Equipment (Mechanical)',
      'Influent Screen / Bar Rack',
      'Screen Assembly',
      'Bar Rack / Mesh Panel',
    );
    expect(leaf?.focusArea).toBe('Section loss, blinding/plugging, distortion of bars from grit and debris loading');
    expect(leaf?.mechanisms).toEqual(['CML - Corrosion & Material Loss', 'FLW - Flow-Induced Damage']);
  });

  it('mine-legacy rows carry the extra MSB/BCF codes beyond the 15-category picklist', () => {
    const leaf = taxonomyLeaf(
      'Foundations & Geotechnical',
      'Legacy Mine Ground Interface',
      'Void / Subsidence Zones',
      'Shallow Voids, Collapsed Workings',
    );
    expect(leaf?.mechanisms).toEqual([
      'MSB - Mine Subsidence & Ground Instability',
      'BCF - Bearing Capacity Failure',
    ]);
  });

  it('returns empty options / undefined leaf for an invalid or incomplete path', () => {
    expect(equipmentTypesFor('Nope')).toEqual([]);
    expect(componentsFor('Building Envelope', 'Influent Screen / Bar Rack')).toEqual([]);
    expect(taxonomyLeaf('Building Envelope', 'Roofing Systems', 'Membrane / Metal Roof', 'Wrong Sub')).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import { DEFICIENCY_REFERENCE, deficiencyByCode, deficiencyByLabel } from './deficiencyReference';
import { TAXONOMY } from './taxonomy';
import { DEFICIENCY_CATEGORIES } from './lookups';

describe('deficiency reference data (generated from the workbook sheet)', () => {
  it('has all 19 codes in sheet order, unique', () => {
    const codes = DEFICIENCY_REFERENCE.map((d) => d.code);
    expect(codes).toEqual([
      'CML', 'CRK', 'DFI', 'CFI', 'FDS', 'CND', 'ENV', 'GHK', 'MSI', 'THR',
      'EWF', 'SIE', 'FH', 'BCF', 'PF', 'LOC', 'OPR', 'FLW', 'MSB',
    ]);
    expect(new Set(codes).size).toBe(19);
  });

  it('every entry has a name, definition and site relevance', () => {
    for (const d of DEFICIENCY_REFERENCE) {
      expect(d.name.length).toBeGreaterThan(0);
      expect(d.definition.length).toBeGreaterThan(0);
      expect(d.siteRelevance.length).toBeGreaterThan(0);
      expect(d.label).toBe(`${d.code} - ${d.name}`);
    }
  });

  it('exposes the exact frost-heave row shown in the sheet (screenshot spot-check)', () => {
    const fh = deficiencyByCode('FH');
    expect(fh?.name).toBe('Frost Heave');
    expect(fh?.definition).toBe(
      'Ground movement (upward heave, cracking) from freeze-thaw cycling in frost-susceptible soils.',
    );
    expect(fh?.siteRelevance).toBe('Climate-dependent; relevant for shallow foundations in cold-climate sites.');
  });

  it('looks up by full label too', () => {
    expect(deficiencyByLabel('MSB - Mine Subsidence & Ground Instability')?.code).toBe('MSB');
    expect(deficiencyByLabel('XXX - Nope')).toBeUndefined();
  });
});

describe('cross-domain consistency', () => {
  it('every mechanism label used in the Taxonomy resolves to a reference entry', () => {
    const labels = new Set(DEFICIENCY_REFERENCE.map((d) => d.label));
    const unresolved = new Set<string>();
    for (const row of TAXONOMY) {
      for (const m of row.mechanisms) if (!labels.has(m)) unresolved.add(m);
    }
    expect([...unresolved]).toEqual([]);
  });

  it('is a superset of the 15-category Inspections picklist', () => {
    const refCodes = new Set(DEFICIENCY_REFERENCE.map((d) => d.code));
    for (const cat of DEFICIENCY_CATEGORIES) {
      expect(refCodes.has(cat.code)).toBe(true);
    }
    expect(DEFICIENCY_REFERENCE.length).toBeGreaterThan(DEFICIENCY_CATEGORIES.length);
  });
});

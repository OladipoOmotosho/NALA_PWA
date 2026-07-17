import { describe, expect, it } from 'vitest';
import { priorityDescription, riskRank, riskRating } from './derive';

describe('riskRank (3×3 matrix, High=3 Med=2 Low=1)', () => {
  it('multiplies severity × likelihood', () => {
    expect(riskRank('High', 'High')).toBe(9);
    expect(riskRank('High', 'Medium')).toBe(6);
    expect(riskRank('Medium', 'Medium')).toBe(4);
    expect(riskRank('Medium', 'Low')).toBe(2);
    expect(riskRank('Low', 'Low')).toBe(1);
  });

  it('returns null when either input is missing', () => {
    expect(riskRank('', 'High')).toBeNull();
    expect(riskRank('High', '')).toBeNull();
    expect(riskRank('', '')).toBeNull();
  });
});

describe('riskRating bands (High 6–9, Medium 3–4, Low 1–2)', () => {
  it('maps every reachable rank to the spec band', () => {
    expect(riskRating(9)).toBe('High');
    expect(riskRating(6)).toBe('High');
    expect(riskRating(4)).toBe('Medium');
    expect(riskRating(3)).toBe('Medium');
    expect(riskRating(2)).toBe('Low');
    expect(riskRating(1)).toBe('Low');
  });

  it('returns empty for null rank', () => {
    expect(riskRating(null)).toBe('');
  });
});

describe('priorityDescription (workbook Details sheet values)', () => {
  it('derives the exact workbook condition text', () => {
    expect(priorityDescription('P1')).toBe('Critical Condition - Immediate action required');
    expect(priorityDescription('P5')).toBe('Good Condition - No repairs required');
  });

  it('is empty for unknown/unset priority', () => {
    expect(priorityDescription('')).toBe('');
  });
});

import { describe, expect, it } from 'vitest';
import { priorityDescription } from './derive';
import {
  CONSEQUENCE_LEVELS,
  LIKELIHOOD_LEVELS,
  priorityFromRank,
  riskRank,
  riskRating,
  type ConsequenceLevel,
  type LikelihoodLevel,
} from './riskMatrix';

/** Every cell of Dipo's reference chart (2026-07-24): [rank, priority] by consequence row, likelihood column. */
const EXPECTED: Record<string, Record<string, [number, string]>> = {
  '5': { A: [25, 'P1'], B: [24, 'P1'], C: [22, 'P1'], D: [19, 'P2'], E: [15, 'P2'] },
  '4': { A: [23, 'P1'], B: [21, 'P1'], C: [18, 'P2'], D: [14, 'P3'], E: [10, 'P3'] },
  '3': { A: [20, 'P1'], B: [17, 'P2'], C: [13, 'P3'], D: [9, 'P4'], E: [6, 'P4'] },
  '2': { A: [16, 'P2'], B: [12, 'P3'], C: [8, 'P4'], D: [5, 'P4'], E: [3, 'P5'] },
  '1': { A: [11, 'P3'], B: [7, 'P4'], C: [4, 'P5'], D: [2, 'P5'], E: [1, 'P5'] },
};

describe('Glencore 5×5 risk matrix', () => {
  it('reproduces all 25 cells of the reference chart (rank and assigned priority)', () => {
    for (const consequence of CONSEQUENCE_LEVELS) {
      for (const likelihood of LIKELIHOOD_LEVELS) {
        const [expectedRank, expectedPriority] = EXPECTED[consequence[0]][likelihood[0]];
        const rank = riskRank(consequence, likelihood);
        expect(rank, `${consequence} × ${likelihood}`).toBe(expectedRank);
        expect(priorityFromRank(rank), `${consequence} × ${likelihood}`).toBe(expectedPriority);
      }
    }
  });

  it('returns null rank when either input is missing', () => {
    expect(riskRank('', 'A - Almost Certain')).toBeNull();
    expect(riskRank('5 - Catastrophic', '')).toBeNull();
    expect(riskRank('', '')).toBeNull();
  });

  it('maps ranks to Risk Rating bands (High 17–25, Medium 7–16, Low 1–6)', () => {
    expect(riskRating(25)).toBe('High');
    expect(riskRating(17)).toBe('High');
    expect(riskRating(16)).toBe('Medium');
    expect(riskRating(7)).toBe('Medium');
    expect(riskRating(6)).toBe('Low');
    expect(riskRating(1)).toBe('Low');
    expect(riskRating(null)).toBe('');
  });

  it('maps ranks to priority bands (P1 20–25, P2 15–19, P3 10–14, P4 5–9, P5 1–4)', () => {
    expect(priorityFromRank(20)).toBe('P1');
    expect(priorityFromRank(19)).toBe('P2');
    expect(priorityFromRank(15)).toBe('P2');
    expect(priorityFromRank(14)).toBe('P3');
    expect(priorityFromRank(10)).toBe('P3');
    expect(priorityFromRank(9)).toBe('P4');
    expect(priorityFromRank(5)).toBe('P4');
    expect(priorityFromRank(4)).toBe('P5');
    expect(priorityFromRank(1)).toBe('P5');
    expect(priorityFromRank(null)).toBe('');
  });

  it('every rank in the matrix is unique (1–25, no duplicates)', () => {
    const ranks: number[] = [];
    for (const c of CONSEQUENCE_LEVELS) {
      for (const l of LIKELIHOOD_LEVELS) {
        ranks.push(riskRank(c as ConsequenceLevel, l as LikelihoodLevel)!);
      }
    }
    expect(new Set(ranks).size).toBe(25);
    expect(Math.min(...ranks)).toBe(1);
    expect(Math.max(...ranks)).toBe(25);
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

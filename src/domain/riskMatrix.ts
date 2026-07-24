/**
 * Glencore 5×5 risk matrix — confirmed by Dipo 2026-07-24, resolving the
 * Dataverse spec §5.3 / open-question #22 (the workbook's Site Summary bands
 * already matched: High 17–25, Medium 7–16, Low 1–6).
 *
 * Rows = Consequence (5 Catastrophic → 1 Negligible)
 * Columns = Likelihood (A Almost Certain → E Rare)
 * Cell = Risk Rank (1–25) → assigned Priority:
 *   P1: 20–25 · P2: 15–19 · P3: 10–14 · P4: 5–9 · P5: 1–4
 */
import type { PriorityRating, RiskLevel } from './lookups';

export const CONSEQUENCE_LEVELS = [
  '5 - Catastrophic',
  '4 - Major',
  '3 - Moderate',
  '2 - Minor',
  '1 - Negligible',
] as const;
export type ConsequenceLevel = (typeof CONSEQUENCE_LEVELS)[number];

export const LIKELIHOOD_LEVELS = [
  'A - Almost Certain',
  'B - Likely',
  'C - Possible',
  'D - Unlikely',
  'E - Rare',
] as const;
export type LikelihoodLevel = (typeof LIKELIHOOD_LEVELS)[number];

/** rank = RANK_MATRIX[consequence digit][likelihood letter] */
const RANK_MATRIX: Record<string, Record<string, number>> = {
  '5': { A: 25, B: 24, C: 22, D: 19, E: 15 },
  '4': { A: 23, B: 21, C: 18, D: 14, E: 10 },
  '3': { A: 20, B: 17, C: 13, D: 9, E: 6 },
  '2': { A: 16, B: 12, C: 8, D: 5, E: 3 },
  '1': { A: 11, B: 7, C: 4, D: 2, E: 1 },
};

export function riskRank(consequence: ConsequenceLevel | '', likelihood: LikelihoodLevel | ''): number | null {
  if (!consequence || !likelihood) return null;
  return RANK_MATRIX[consequence[0]]?.[likelihood[0]] ?? null;
}

/** Workbook Site Summary bands: High 17–25, Medium 7–16, Low 1–6. */
export function riskRating(rank: number | null): RiskLevel | '' {
  if (rank === null) return '';
  if (rank >= 17) return 'High';
  if (rank >= 7) return 'Medium';
  return 'Low';
}

/** Priority is assigned by the matrix (cell colour in the reference chart), not hand-picked. */
export function priorityFromRank(rank: number | null): PriorityRating | '' {
  if (rank === null) return '';
  if (rank >= 20) return 'P1';
  if (rank >= 15) return 'P2';
  if (rank >= 10) return 'P3';
  if (rank >= 5) return 'P4';
  return 'P5';
}

import { PRIORITY_DESCRIPTIONS } from './lookups';
import type { RiskLevel } from './lookups';

const SCORE: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

/** 3×3 matrix per spec §5.3 (pending Nerizon confirmation of the Glencore 5×5 question). */
export function riskRank(severity: RiskLevel | '', likelihood: RiskLevel | ''): number | null {
  if (!severity || !likelihood) return null;
  return SCORE[severity] * SCORE[likelihood];
}

export function riskRating(rank: number | null): RiskLevel | '' {
  if (rank === null) return '';
  if (rank >= 6) return 'High';
  if (rank >= 3) return 'Medium';
  return 'Low';
}

export function priorityDescription(priority: string): string {
  return PRIORITY_DESCRIPTIONS[priority] ?? '';
}

import { PRIORITY_DESCRIPTIONS } from './lookups';
export { riskRank, riskRating, priorityFromRank } from './riskMatrix';

export function priorityDescription(priority: string): string {
  return PRIORITY_DESCRIPTIONS[priority] ?? '';
}

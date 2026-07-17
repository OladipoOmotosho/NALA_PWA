import { beforeEach, describe, expect, it } from 'vitest';
import { db } from './db';
import { applyDerived, newSubmission, saveSubmission, validateForSubmit, discardSubmission } from './submissions';
import type { Submission } from '../domain/types';

async function makeValid(): Promise<Submission> {
  const s = await newSubmission();
  return {
    ...s,
    assetTag: 'AST-001',
    inspectorName: 'Test Engineer',
    componentType: 'Roofing',
    deficiencyCategory: 'CML - Corrosion & Material Loss',
    detailedDescription: 'Corrosion of steel deck',
    consequenceSeverity: 'High',
    likelihood: 'Medium',
    priorityRating: 'P2',
  };
}

beforeEach(async () => {
  await Promise.all([db.submissions.clear(), db.photos.clear(), db.meta.clear()]);
});

describe('validateForSubmit', () => {
  it('lists every missing required field on an empty record', async () => {
    const s = await newSubmission();
    s.inspectorName = '';
    const missing = validateForSubmit(s);
    expect(missing).toContain('Asset ID');
    expect(missing).toContain('Component Type');
    expect(missing).toContain('Deficiency Category');
    expect(missing).toContain('Priority Rating');
  });

  it('passes a fully filled record', async () => {
    expect(validateForSubmit(await makeValid())).toEqual([]);
  });
});

describe('applyDerived', () => {
  it('derives priority description and risk rank/rating', async () => {
    const s = await makeValid();
    const d = applyDerived(s);
    expect(d.priorityDescription).toBe('Poor Condition - Repair actions needed within 12 months');
    expect(d.riskRank).toBe(6); // High(3) × Medium(2)
    expect(d.riskRating).toBe('High');
  });

  it('forces Immediate Site Notification = Yes for P1 (spec §4.3)', async () => {
    const s = await makeValid();
    s.priorityRating = 'P1';
    s.immediateSiteNotification = false;
    expect(applyDerived(s).immediateSiteNotification).toBe(true);
  });
});

describe('saveSubmission (durable local save, PRD §7.8/§10)', () => {
  it('assigns a monotonic submissionSequence on first persist and keeps it on edits', async () => {
    const a = await saveSubmission(await makeValid(), 'pending');
    const b = await saveSubmission(await makeValid(), 'pending');
    expect(a.submissionSequence).toBe(1);
    expect(b.submissionSequence).toBe(2);
    const aEdited = await saveSubmission({ ...a, recommendedAction: 'edit' }, 'pending');
    expect(aEdited.submissionSequence).toBe(1);
  });

  it('increments clientRowVersion on each save and resets retry bookkeeping', async () => {
    const first = await saveSubmission(await makeValid(), 'draft');
    expect(first.clientRowVersion).toBe(1);
    const second = await saveSubmission({ ...first, attemptCount: 5, lastError: 'x' }, 'pending');
    expect(second.clientRowVersion).toBe(2);
    expect(second.attemptCount).toBe(0);
    expect(second.lastError).toBe('x'); // lastError preserved for audit; only counters reset
  });

  it('a re-edit of a synced record returns it to pending (state machine)', async () => {
    const rec = await saveSubmission(await makeValid(), 'pending');
    await db.submissions.update(rec.clientRecordId, { syncStatus: 'synced' });
    const reEdited = await saveSubmission({ ...rec, syncStatus: 'synced' }, 'pending');
    expect(reEdited.syncStatus).toBe('pending');
  });

  it('sets validationPassed=false when queued incomplete as draft', async () => {
    const s = await newSubmission();
    const saved = await saveSubmission(s, 'draft');
    expect(saved.validationPassed).toBe(false);
  });
});

describe('discardSubmission', () => {
  it('soft-deletes, never removes the row (PRD: no hard delete before sync)', async () => {
    const rec = await saveSubmission(await makeValid(), 'draft');
    await discardSubmission(rec.clientRecordId);
    const row = await db.submissions.get(rec.clientRecordId);
    expect(row).toBeDefined();
    expect(row?.isDeleted).toBe(true);
  });
});

import { db } from './db';
import { getMeta, nextSequence, getDeviceId, detectPlatform } from './meta';
import { SCHEMA_VERSION, type Submission } from '../domain/types';
import { priorityDescription, riskRank, riskRating } from '../domain/derive';

export const APP_VERSION = '0.1.0';

export function todayLocalDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export async function newSubmission(): Promise<Submission> {
  const [deviceId, engineerEmail, inspectorName] = await Promise.all([
    getDeviceId(),
    getMeta<string>('engineerEmail'),
    getMeta<string>('inspectorName'),
  ]);
  return {
    clientRecordId: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    syncStatus: 'draft',
    attemptCount: 0,
    lastError: null,
    nextAttemptAtUtc: null,
    capturedAtUtc: new Date().toISOString(),
    syncedAtUtc: null,
    submissionSequence: 0, // assigned on first persist
    clientRowVersion: 0,
    engineerEmail: engineerEmail ?? '',
    deviceId,
    platform: detectPlatform(),
    appVersion: APP_VERSION,
    latitude: null,
    longitude: null,
    gpsAccuracyM: null,
    locationSource: 'unavailable',
    assetTag: '',
    siteCode: '',
    parentAsset: '',
    assetCategory: '',
    assetUnresolved: false,
    photoCount: 0,
    validationPassed: false,
    isDeleted: false,
    inspectionDate: todayLocalDate(),
    inspectorName: inspectorName ?? engineerEmail ?? '',
    ppeRequirementsMet: null,
    equipmentType: '',
    componentType: '',
    subComponent: '',
    deficiencyCategory: '',
    detailedDescription: '',
    mechanism: '',
    vibrationPresent: null,
    consequenceSeverity: '',
    mostAffectedConsequence: '',
    priorityRating: '',
    priorityDescription: '',
    recommendedAction: '',
    immediateSiteNotification: null,
    furtherInvestigationRequired: null,
    ndtRequired: null,
    focusArea: '',
    likelihood: '',
    riskRank: null,
    riskRating: '',
  };
}

/** Required before Submit (Dataverse spec §4.3 rule set). Drafts may be incomplete. */
export function validateForSubmit(s: Submission): string[] {
  const missing: string[] = [];
  if (!s.assetTag.trim()) missing.push('Asset ID');
  if (!s.inspectionDate) missing.push('Inspection Date');
  if (!s.inspectorName.trim()) missing.push('Inspector Name');
  if (!s.componentType) missing.push('Component Type');
  if (!s.deficiencyCategory) missing.push('Deficiency Category');
  if (!s.detailedDescription) missing.push('Detailed Description');
  if (!s.consequenceSeverity) missing.push('Consequence Severity');
  if (!s.likelihood) missing.push('Likelihood');
  if (!s.priorityRating) missing.push('Priority Rating');
  return missing;
}

/** Apply derived fields (never hand-typed): priority description, risk rank/rating, P1 rule. */
export function applyDerived(s: Submission): Submission {
  const rank = riskRank(s.consequenceSeverity, s.likelihood);
  const out: Submission = {
    ...s,
    priorityDescription: priorityDescription(s.priorityRating),
    riskRank: rank,
    riskRating: riskRating(rank),
  };
  if (out.priorityRating === 'P1') out.immediateSiteNotification = true; // forced, spec §4.3
  return out;
}

/**
 * Durable local save (PRD §7.8). `status` 'draft' keeps it resumable; 'pending' queues it.
 * A local re-edit of a synced record returns it to 'pending' with clientRowVersion++.
 */
export async function saveSubmission(form: Submission, status: 'draft' | 'pending'): Promise<Submission> {
  const derived = applyDerived(form);
  const existing = await db.submissions.get(derived.clientRecordId);
  const record: Submission = {
    ...derived,
    submissionSequence:
      existing && existing.submissionSequence > 0 ? existing.submissionSequence : await nextSequence(),
    clientRowVersion: existing ? existing.clientRowVersion + 1 : 1,
    syncStatus: status,
    validationPassed: validateForSubmit(derived).length === 0,
    // any local edit/re-queue resets retry bookkeeping
    attemptCount: 0,
    nextAttemptAtUtc: null,
  };
  await db.submissions.put(record);
  return record;
}

/** Soft delete only — never hard-delete a captured record before it has synced (PRD §6.1). */
export async function discardSubmission(clientRecordId: string): Promise<void> {
  await db.submissions.update(clientRecordId, { isDeleted: true });
}

/** Copy-forward from the asset's previous inspection (PRD §7.4). */
export async function previousForAsset(assetTag: string): Promise<Submission | undefined> {
  const rows = await db.submissions
    .where('assetTag')
    .equals(assetTag)
    .and((r) => !r.isDeleted)
    .toArray();
  rows.sort((a, b) => b.capturedAtUtc.localeCompare(a.capturedAtUtc));
  return rows[0];
}

/** Guarded purge for diagnostics: only synced records with all photos uploaded, older than N days. */
export async function purgeSynced(olderThanDays: number): Promise<number> {
  const cutoff = new Date(Date.now() - olderThanDays * 86_400_000).toISOString();
  const candidates = await db.submissions
    .where('syncStatus')
    .equals('synced')
    .and((r) => r.capturedAtUtc < cutoff)
    .toArray();
  let purged = 0;
  for (const rec of candidates) {
    const photos = await db.photos.where('clientRecordId').equals(rec.clientRecordId).toArray();
    if (photos.some((p) => !p.uploaded)) continue;
    await db.transaction('rw', db.submissions, db.photos, async () => {
      await db.photos.where('clientRecordId').equals(rec.clientRecordId).delete();
      await db.submissions.delete(rec.clientRecordId);
    });
    purged++;
  }
  return purged;
}

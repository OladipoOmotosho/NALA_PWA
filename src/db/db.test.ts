/**
 * v1→v2 migration test: a photo captured before the Photo_Register-parity
 * upgrade must backfill Date Taken from its linked submission's
 * capturedAtUtc, not the moment the migration happens to run.
 */
import { afterEach, describe, expect, it } from 'vitest';
import Dexie from 'dexie';
import { FieldDb } from './db';
import type { Submission } from '../domain/types';

const TEST_DB_NAME = 'nala-field-inspections-migration-test';

const V1_SCHEMA = {
  submissions: 'clientRecordId, syncStatus, assetTag, capturedAtUtc, submissionSequence',
  photos: 'photoId, clientRecordId',
  assets: 'assetTag, siteCode',
  meta: 'key',
};

function makeSubmission(overrides: Partial<Submission> = {}): Submission {
  return {
    clientRecordId: 'rec-1',
    schemaVersion: 1,
    syncStatus: 'synced',
    attemptCount: 0,
    lastError: null,
    nextAttemptAtUtc: null,
    capturedAtUtc: '2026-01-05T09:30:00.000Z',
    syncedAtUtc: null,
    submissionSequence: 1,
    clientRowVersion: 1,
    engineerEmail: '',
    deviceId: 'dev-1',
    platform: 'other',
    appVersion: '0.1.0',
    latitude: null,
    longitude: null,
    gpsAccuracyM: null,
    locationSource: 'unavailable',
    assetTag: 'AST-1',
    siteCode: '',
    parentAsset: '',
    assetCategory: '',
    assetUnresolved: false,
    photoCount: 1,
    validationPassed: false,
    isDeleted: false,
    inspectionDate: '2026-01-05',
    inspectorName: 'T',
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
    ...overrides,
  };
}

afterEach(async () => {
  await Dexie.delete(TEST_DB_NAME);
});

describe('FieldDb v1 -> v2 migration', () => {
  it('backfills Date Taken from the linked submission, not the migration time', async () => {
    // Seed a v1-only database — the pre Photo_Register-parity shape has no
    // dateTakenUtc/inspectorName/photoDescription on the photo row.
    const v1 = new Dexie(TEST_DB_NAME);
    v1.version(1).stores(V1_SCHEMA);
    await v1.open();
    const submission = makeSubmission();
    await v1.table('submissions').add(submission);
    await v1.table('photos').add({
      photoId: 'ph-1',
      clientRecordId: submission.clientRecordId,
      blob: new Blob(['x']),
      filename: 'rec-1_1.jpg',
      uploaded: false,
      byteSize: 1,
    });
    v1.close();

    // Open the real FieldDb (v1+v2) against the same underlying database —
    // this exercises the actual production migration, not a re-implementation.
    const upgraded = new FieldDb(TEST_DB_NAME);
    await upgraded.open();
    const photo = await upgraded.photos.get('ph-1');

    expect(photo?.dateTakenUtc).toBe(submission.capturedAtUtc);
    expect(photo?.dateTakenUtc).not.toBe(new Date().toISOString().slice(0, 10)); // sanity: not "today"
    expect(photo?.inspectorName).toBe('');
    expect(photo?.photoDescription).toBe('');
    upgraded.close();
  });

  it('falls back to the current time only for an orphaned photo with no matching submission', async () => {
    const v1 = new Dexie(TEST_DB_NAME);
    v1.version(1).stores(V1_SCHEMA);
    await v1.open();
    await v1.table('photos').add({
      photoId: 'ph-orphan',
      clientRecordId: 'missing-record',
      blob: new Blob(['x']),
      filename: 'orphan.jpg',
      uploaded: false,
      byteSize: 1,
    });
    v1.close();

    const before = Date.now();
    const upgraded = new FieldDb(TEST_DB_NAME);
    await upgraded.open();
    const photo = await upgraded.photos.get('ph-orphan');

    expect(photo?.dateTakenUtc).toBeTruthy();
    expect(new Date(photo!.dateTakenUtc).getTime()).toBeGreaterThanOrEqual(before - 1000);
    upgraded.close();
  });

  it('leaves an already-migrated photo (dateTakenUtc present) untouched', async () => {
    const v1 = new Dexie(TEST_DB_NAME);
    v1.version(1).stores(V1_SCHEMA);
    await v1.open();
    const submission = makeSubmission();
    await v1.table('submissions').add(submission);
    await v1.table('photos').add({
      photoId: 'ph-already',
      clientRecordId: submission.clientRecordId,
      blob: new Blob(['x']),
      filename: 'rec-1_1.jpg',
      uploaded: false,
      byteSize: 1,
      dateTakenUtc: '2020-06-01T00:00:00.000Z', // deliberately different from capturedAtUtc
      inspectorName: 'Original Inspector',
      photoDescription: 'kept as-is',
    });
    v1.close();

    const upgraded = new FieldDb(TEST_DB_NAME);
    await upgraded.open();
    const photo = await upgraded.photos.get('ph-already');

    expect(photo?.dateTakenUtc).toBe('2020-06-01T00:00:00.000Z');
    expect(photo?.inspectorName).toBe('Original Inspector');
    expect(photo?.photoDescription).toBe('kept as-is');
    upgraded.close();
  });
});

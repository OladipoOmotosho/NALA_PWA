import Dexie, { type Table } from 'dexie';
import type { Submission, PhotoRow, AssetRow, MetaRow } from '../domain/types';

const DB_NAME = 'nala-field-inspections';

export class FieldDb extends Dexie {
  submissions!: Table<Submission, string>;
  photos!: Table<PhotoRow, string>;
  assets!: Table<AssetRow, string>;
  meta!: Table<MetaRow, string>;

  /** `name` is overridable so tests can exercise the real version chain
   * (incl. the v1→v2 migration) against an isolated database. */
  constructor(name: string = DB_NAME) {
    super(name);
    // Booleans (isDeleted, uploaded, isActive) are not valid IndexedDB index keys —
    // they stay as plain fields and are filtered in code, not indexed.
    this.version(1).stores({
      submissions: 'clientRecordId, syncStatus, assetTag, capturedAtUtc, submissionSequence',
      photos: 'photoId, clientRecordId',
      assets: 'assetTag, siteCode',
      meta: 'key',
    });
    // v2: Photo_Register parity — backfill the new photo metadata fields on
    // any rows captured before the upgrade. Date Taken backfills from the
    // linked submission's capturedAtUtc (the photo's actual capture context),
    // NOT the time this migration happens to run — that would silently
    // corrupt every historical Date Taken value uploaded to Photo_Register.
    this.version(2).upgrade(async (tx) => {
      const submissions = (await tx.table('submissions').toArray()) as Submission[];
      const capturedAtByRecord = new Map(submissions.map((s) => [s.clientRecordId, s.capturedAtUtc]));

      await tx
        .table('photos')
        .toCollection()
        .modify((p: Partial<PhotoRow>) => {
          if (!p.dateTakenUtc) {
            // Fallback to "now" only for an orphaned photo with no matching
            // submission — should not happen in practice, but dateTakenUtc
            // is a required non-null field, so something must be written.
            p.dateTakenUtc = capturedAtByRecord.get(p.clientRecordId ?? '') ?? new Date().toISOString();
          }
          p.inspectorName ??= '';
          p.photoDescription ??= '';
        });
    });
  }
}

export const db = new FieldDb();

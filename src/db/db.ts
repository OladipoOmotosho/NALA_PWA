import Dexie, { type Table } from 'dexie';
import type { Submission, PhotoRow, AssetRow, MetaRow } from '../domain/types';

export class FieldDb extends Dexie {
  submissions!: Table<Submission, string>;
  photos!: Table<PhotoRow, string>;
  assets!: Table<AssetRow, string>;
  meta!: Table<MetaRow, string>;

  constructor() {
    super('nala-field-inspections');
    // Booleans (isDeleted, uploaded, isActive) are not valid IndexedDB index keys —
    // they stay as plain fields and are filtered in code, not indexed.
    this.version(1).stores({
      submissions: 'clientRecordId, syncStatus, assetTag, capturedAtUtc, submissionSequence',
      photos: 'photoId, clientRecordId',
      assets: 'assetTag, siteCode',
      meta: 'key',
    });
    // v2: Photo_Register parity — backfill the new photo metadata fields on
    // any rows captured before the upgrade (indexes unchanged).
    this.version(2).upgrade((tx) =>
      tx
        .table('photos')
        .toCollection()
        .modify((p: Partial<PhotoRow>) => {
          p.dateTakenUtc ??= new Date().toISOString();
          p.inspectorName ??= '';
          p.photoDescription ??= '';
        }),
    );
  }
}

export const db = new FieldDb();

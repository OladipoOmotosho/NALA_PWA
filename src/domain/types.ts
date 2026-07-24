import type { PriorityRating, RiskLevel } from './lookups';
import type { ConsequenceLevel, LikelihoodLevel } from './riskMatrix';

/** v2: Glencore 5×5 matrix — consequence 1–5, likelihood A–E, rank 1–25, priority auto-assigned. */
export const SCHEMA_VERSION = 2;

export type SyncStatus =
  | 'draft'
  | 'pending'
  | 'syncing'
  | 'synced'
  | 'failed'
  | 'failedPermanent'
  | 'conflict';

export type LocationSource = 'gps' | 'manual' | 'unavailable';

/** One inspection = one deficiency observation (one row on the workbook's Inspections sheet). */
export interface Submission {
  // --- sync envelope (PRD §6.1) ---
  clientRecordId: string;
  schemaVersion: number;
  syncStatus: SyncStatus;
  attemptCount: number;
  lastError: string | null;
  /** Earliest UTC time the sync engine may retry a failed record (backoff). Not in PRD schema; implementation detail. */
  nextAttemptAtUtc: string | null;
  capturedAtUtc: string;
  syncedAtUtc: string | null;
  submissionSequence: number;
  clientRowVersion: number;
  engineerEmail: string;
  deviceId: string;
  platform: 'ios' | 'android' | 'other';
  appVersion: string;
  latitude: number | null;
  longitude: number | null;
  gpsAccuracyM: number | null;
  locationSource: LocationSource;
  assetTag: string;
  /** Snapshots copied from the asset cache at capture (grey columns in the workbook). */
  siteCode: string;
  parentAsset: string;
  assetCategory: string;
  /** True when the tag wasn't found in the local asset cache; backend resolves later. */
  assetUnresolved: boolean;
  photoCount: number;
  validationPassed: boolean;
  isDeleted: boolean;

  // --- NALA domain fields (Inspections sheet columns 6–27) ---
  inspectionDate: string; // yyyy-mm-dd
  inspectorName: string;
  ppeRequirementsMet: boolean | null;
  equipmentType: string;
  componentType: string;
  subComponent: string;
  deficiencyCategory: string; // full label e.g. "CML - Corrosion & Material Loss"
  detailedDescription: string;
  mechanism: string;
  vibrationPresent: boolean | null;
  consequenceSeverity: ConsequenceLevel | ''; // 5 Catastrophic → 1 Negligible
  mostAffectedConsequence: RiskLevel | '';
  priorityRating: PriorityRating | ''; // derived from Risk Rank (Glencore bands), never hand-picked
  priorityDescription: string; // derived, never hand-typed
  recommendedAction: string;
  immediateSiteNotification: boolean | null;
  furtherInvestigationRequired: boolean | null;
  ndtRequired: boolean | null;
  focusArea: string;
  likelihood: LikelihoodLevel | ''; // A Almost Certain → E Rare
  riskRank: number | null; // derived 1–25 from the matrix
  riskRating: RiskLevel | ''; // derived: High 17–25, Medium 7–16, Low 1–6
}

/** One row = one photo, mirroring the workbook Photo_Register: Date Taken,
 * Inspector Name, Photo Description are captured here; Site / Asset ID /
 * Parent Asset derive from the linked inspection at upload time. */
export interface PhotoRow {
  photoId: string;
  clientRecordId: string;
  blob: Blob;
  filename: string;
  uploaded: boolean;
  byteSize: number;
  dateTakenUtc: string;
  inspectorName: string;
  photoDescription: string;
}

export interface AssetRow {
  assetTag: string; // Asset ID
  parentAsset: string;
  assetCategory: string;
  component: string;
  siteCode: string;
  locationDescription: string;
  accessNotes: string;
  latitude: number | null;
  longitude: number | null;
  lastInspectedUtc: string | null;
  isActive: boolean; // In Scope
}

export interface MetaRow {
  key: string;
  value: string | number | boolean | null;
}

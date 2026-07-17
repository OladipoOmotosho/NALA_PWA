import { db } from './db';
import type { AssetRow } from '../domain/types';

export function getAsset(assetTag: string): Promise<AssetRow | undefined> {
  return db.assets.get(assetTag);
}

export function countAssets(): Promise<number> {
  return db.assets.count();
}

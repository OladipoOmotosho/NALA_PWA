/** Photo capture section (PRD §7.7). Object URLs are owned by PhotoThumb and revoked on unmount. */
import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { addPhoto, listPhotos, removePhoto, MAX_PHOTOS_PER_RECORD } from '../../util/photos';
import type { PhotoRow } from '../../domain/types';

function PhotoThumb({ photo, onRemove }: { photo: PhotoRow; onRemove: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = URL.createObjectURL(photo.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [photo.blob]);

  return (
    <figure className="photo-thumb">
      {url && <img src={url} alt={photo.filename} />}
      <button type="button" className="photo-remove" aria-label="Remove photo" onClick={onRemove}>
        ×
      </button>
    </figure>
  );
}

interface Props {
  clientRecordId: string;
  /** Persist the parent record before attaching, so photos never orphan. */
  ensurePersisted: () => Promise<void>;
  onMessage: (msg: string) => void;
  onCountChange: (n: number) => void;
}

export function PhotoSection({ clientRecordId, ensurePersisted, onMessage, onCountChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photos = useLiveQuery(() => listPhotos(clientRecordId), [clientRecordId], [] as PhotoRow[]);

  const onPicked = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await ensurePersisted();
    for (const file of Array.from(files)) {
      const res = await addPhoto(clientRecordId, file);
      if (!res.ok) {
        onMessage(
          res.reason === 'quota'
            ? 'Storage is nearly full — photo capture is blocked. Text capture still works.'
            : res.reason === 'cap'
              ? `Photo cap reached (${MAX_PHOTOS_PER_RECORD} per record).`
              : 'Could not read that image.',
        );
        break;
      }
      onCountChange(res.photoCount);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="card">
      <h2>
        Photos{' '}
        <span className="muted">
          ({photos.length}/{MAX_PHOTOS_PER_RECORD})
        </span>
      </h2>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={(e) => void onPicked(e.target.files)}
      />
      <button type="button" className="btn" onClick={() => fileInputRef.current?.click()}>
        Add photo
      </button>
      <div className="photo-grid">
        {photos.map((p) => (
          <PhotoThumb key={p.photoId} photo={p} onRemove={() => void removePhoto(p.photoId)} />
        ))}
      </div>
    </section>
  );
}

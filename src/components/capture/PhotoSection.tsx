/** Photo capture section (PRD §7.7). Object URLs are owned by PhotoThumb and revoked on unmount. */
import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { addPhoto, listPhotos, removePhoto, updatePhotoDescription, MAX_PHOTOS_PER_RECORD } from '../../util/photos';
import type { PhotoRow } from '../../domain/types';
import { Button } from '../../ui/Button';
import { TextInput } from '../../ui/TextInput';
import p from '../../styles/primitives.module.css';
import styles from './PhotoSection.module.css';

function PhotoThumb({ photo, onRemove }: { photo: PhotoRow; onRemove: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  // Local, seeded from the stored description; persisted on blur only (each
  // save re-queues the photo for upload — not something to do per keystroke).
  const [description, setDescription] = useState(photo.photoDescription);

  useEffect(() => {
    const u = URL.createObjectURL(photo.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [photo.blob]);

  return (
    <figure className={styles.thumb}>
      {url && <img src={url} alt={photo.filename} />}
      {/* Small circular overlay control — kept native; ui/Button's fixed
       * padding/min-height doesn't fit this layered icon-only affordance. */}
      <button type="button" className={styles.remove} aria-label="Remove photo" onClick={onRemove}>
        ×
      </button>
      <TextInput
        placeholder="Description…"
        aria-label="Photo description"
        value={description}
        onChangeText={setDescription}
        onBlur={() => void updatePhotoDescription(photo.photoId, description.trim())}
      />
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
    <section className={p.card}>
      <h2>
        Photos{' '}
        <span className={p.muted}>
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
      <Button onClick={() => fileInputRef.current?.click()}>Add photo</Button>
      <div className={styles.grid}>
        {photos.map((photo) => (
          <PhotoThumb key={photo.photoId} photo={photo} onRemove={() => void removePhoto(photo.photoId)} />
        ))}
      </div>
    </section>
  );
}

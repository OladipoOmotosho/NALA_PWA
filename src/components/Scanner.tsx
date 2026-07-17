/** QR/barcode scan (PRD §7.5): native BarcodeDetector where available, zxing fallback (iOS). */
import { useEffect, useRef, useState } from 'react';
import { log } from '../util/log';

interface Props {
  onDetected: (value: string) => void;
  onClose: () => void;
}

type BarcodeDetectorLike = {
  detect(source: CanvasImageSource): Promise<Array<{ rawValue: string }>>;
};
type BarcodeDetectorCtor = new (opts?: { formats?: string[] }) => BarcodeDetectorLike;

export function Scanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let zxingStop: (() => void) | null = null;
    let cancelled = false;

    const finish = (value: string) => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDetected(value.trim());
    };

    async function start() {
      const video = videoRef.current;
      if (!video) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
      } catch {
        setError('Camera unavailable or permission denied. Enter the Asset ID manually.');
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      video.srcObject = stream;
      await video.play().catch(() => undefined);

      const Detector = (globalThis as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
      log.info('scanner', Detector ? 'using native BarcodeDetector' : 'BarcodeDetector unavailable — using zxing fallback');
      if (Detector) {
        const detector = new Detector({ formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'data_matrix'] });
        const tick = async () => {
          if (cancelled || doneRef.current) return;
          try {
            if (video.readyState >= 2) {
              const codes = await detector.detect(video);
              if (codes.length > 0 && codes[0].rawValue) {
                finish(codes[0].rawValue);
                return;
              }
            }
          } catch {
            // keep scanning
          }
          raf = requestAnimationFrame(() => void tick());
        };
        raf = requestAnimationFrame(() => void tick());
      } else {
        // iOS Safari path
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromVideoElement(video, (result) => {
          if (result) finish(result.getText());
        });
        zxingStop = () => controls.stop();
      }
    }

    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      zxingStop?.();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onDetected]);

  return (
    <div className="scanner-overlay">
      <video ref={videoRef} playsInline muted className="scanner-video" />
      <div className="scanner-frame" />
      {error && <p className="scanner-error">{error}</p>}
      <button type="button" className="btn btn-secondary scanner-close" onClick={onClose}>
        Cancel scan
      </button>
    </div>
  );
}

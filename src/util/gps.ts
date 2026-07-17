/** GPS autofill (PRD §7.6): attempt a fix with a timeout; never block the save. */

export interface GpsFix {
  latitude: number | null;
  longitude: number | null;
  gpsAccuracyM: number | null;
  locationSource: 'gps' | 'unavailable';
}

export function getGpsFix(timeoutMs = 10_000): Promise<GpsFix> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve({ latitude: null, longitude: null, gpsAccuracyM: null, locationSource: 'unavailable' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          gpsAccuracyM: pos.coords.accuracy ?? null,
          locationSource: 'gps',
        }),
      () => resolve({ latitude: null, longitude: null, gpsAccuracyM: null, locationSource: 'unavailable' }),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}

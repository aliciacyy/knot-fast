import { GarminRun } from './runs';

export function decodePolyline(encoded: string): [number, number][] {
  let index = 0;
  let latitude = 0;
  let longitude = 0;
  const coordinates: [number, number][] = [];

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude += result & 1 ? ~(result >> 1) : result >> 1;
    coordinates.push([latitude / 1e5, longitude / 1e5]);
  }

  return coordinates;
}

export function buildRoutePath(points: [number, number][]) {
  if (points.length === 0) {
    return { d: '', viewBox: '0 0 100 100' };
  }

  const lats = points.map(([lat]) => lat);
  const lngs = points.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const width = Math.max(maxLng - minLng, 0.0001);
  const height = Math.max(maxLat - minLat, 0.0001);
  const padding = 10;
  const canvas = 100;

  const d = points
    .map(([lat, lng], index) => {
      const x = ((lng - minLng) / width) * (canvas - padding * 2) + padding;
      const y =
        canvas - (((lat - minLat) / height) * (canvas - padding * 2) + padding);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  return { d, viewBox: `0 0 ${canvas} ${canvas}` };
}

export function formatDistance(distanceInMeters: number) {
  return `${(distanceInMeters / 1000).toFixed(2)} km`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export function formatPace(distanceInMeters: number, seconds: number) {
  const secondsPerKilometer = seconds / (distanceInMeters / 1000);
  const minutes = Math.floor(secondsPerKilometer / 60);
  const remainder = Math.round(secondsPerKilometer % 60);

  if (remainder === 60) {
    return `${minutes + 1}:00/km`;
  }

  return `${minutes}:${remainder.toString().padStart(2, '0')}/km`;
}

export function formatRunDate(iso: string) {
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function formatCompactDate(iso: string) {
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function getRunMood(run: GarminRun) {
  const parts: string[] = [];

  if (run.average_temp >= 28) parts.push('Warm');
  if (run.average_heartrate >= 155) parts.push('strong effort');
  else parts.push('steady effort');

  if (run.distance < 4000) parts.push('short route');
  else if (run.distance >= 7000) parts.push('longer outing');

  return parts.join(', ');
}

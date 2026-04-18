import { groq } from 'next-sanity';
import { sanityClient } from './sanityClient';

type RunStatSource = {
  distanceMeters?: number | null;
  movingTimeSeconds?: number | null;
};

export type RunStats = {
  totalRuns: number;
  totalDistanceMeters: number;
  totalTimeSeconds: number;
  averagePaceSecondsPerKm: number;
  formatted: {
    totalDistanceKilometers: string;
    totalTime: string;
    averagePace: string;
  };
};

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  return [hours, minutes, remainder]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

function formatPace(secondsPerKm: number) {
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) {
    return '0:00/km';
  }

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);

  if (seconds === 60) {
    return `${minutes + 1}:00/km`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}/km`;
}

export async function getRunStats(): Promise<RunStats> {
  const query = groq`
    *[_type=="run"]{
      distanceMeters,
      movingTimeSeconds
    }
  `;
  const runs = await sanityClient.fetch<RunStatSource[]>(
    query,
    {},
    { next: { revalidate: 60 } },
  );

  const totalRuns = runs.length;
  const totalDistanceMeters = runs.reduce(
    (sum, run) => sum + (run.distanceMeters ?? 0),
    0,
  );
  const totalTimeSeconds = runs.reduce(
    (sum, run) => sum + (run.movingTimeSeconds ?? 0),
    0,
  );
  const averagePaceSecondsPerKm =
    totalDistanceMeters > 0 ? totalTimeSeconds / (totalDistanceMeters / 1000) : 0;

  return {
    totalRuns,
    totalDistanceMeters: Number(totalDistanceMeters.toFixed(1)),
    totalTimeSeconds,
    averagePaceSecondsPerKm: Number(averagePaceSecondsPerKm.toFixed(2)),
    formatted: {
      totalDistanceKilometers: `${(totalDistanceMeters / 1000).toFixed(2)} km`,
      totalTime: formatDuration(totalTimeSeconds),
      averagePace: formatPace(averagePaceSecondsPerKm),
    },
  };
}

export async function getWorkPublishedDates(): Promise<string[]> {
  const query = groq`
    *[_type=="project" && defined(publishedAt)]
    | order(publishedAt asc)
    .publishedAt
  `;
  return sanityClient.fetch(query, {}, { next: { revalidate: 300 } });
}

export async function getRunDates(): Promise<string[]> {
  const query = groq`
    *[_type=="run" && defined(startDateLocal)]
    | order(startDateLocal asc)
    .startDateLocal
  `;
  return sanityClient.fetch(query, {}, { next: { revalidate: 300 } });
}

export type MonthCount = {
  key: string; // "YYYY-MM"
  label: string; // "Mar"
  year: number;
  month: number; // 1-12
  count: number;
};

export function buildCurrentPlusNonEmptyPastMonths(
  dates: string[],
  now = new Date(),
): MonthCount[] {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const counts = new Map<string, number>();

  for (const iso of dates) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${month < 10 ? `0${month}` : month}`;

    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  // Current month card always exists (even if 0)
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;
  const curKey = `${curYear}-${curMonth < 10 ? `0${curMonth}` : curMonth}`;

  const allKeys = Array.from(counts.keys());

  // Only months strictly older than current month AND with count > 0
  const pastKeys = allKeys
    .filter((k) => k < curKey) // works because YYYY-MM lexicographically sorts
    .sort((a, b) => (a < b ? 1 : -1)); // newest past first
  const pastKeysLimited = pastKeys.slice(0, 11);

  const result: MonthCount[] = [];

  // Add current month first
  result.push({
    key: curKey,
    label: monthNames[now.getMonth()],
    year: curYear,
    month: curMonth,
    count: counts.get(curKey) ?? 0,
  });

  // Add non-empty past months
  for (const key of pastKeysLimited) {
    const [y, m] = key.split('-').map(Number);
    result.push({
      key,
      label: monthNames[(m ?? 1) - 1],
      year: y,
      month: m,
      count: counts.get(key) ?? 0,
    });
  }

  return result;
}

export function buildRecentMonths(
  dates: string[],
  monthsToShow = 12,
  now = new Date(),
): MonthCount[] {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const counts = new Map<string, number>();

  for (const iso of dates) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${month < 10 ? `0${month}` : month}`;

    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from({ length: monthsToShow }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month < 10 ? `0${month}` : month}`;

    return {
      key,
      label: monthNames[date.getMonth()],
      year,
      month,
      count: counts.get(key) ?? 0,
    };
  });
}

import { groq } from 'next-sanity';
import { sanityClient } from './sanityClient';

export async function getWorkPublishedDates(): Promise<string[]> {
  const query = groq`
    *[_type=="project" && defined(publishedAt)]
    | order(publishedAt asc)
    .publishedAt
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

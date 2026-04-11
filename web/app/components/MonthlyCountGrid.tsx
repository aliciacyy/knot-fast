import Link from 'next/link';
import type { MonthCount } from '../lib/stats';

function intensityClass(count: number) {
  if (count <= 0) return 'bg-white/40 border-black/10';
  if (count === 1) return 'bg-black/5 border-black/10';
  if (count === 2) return 'bg-black/10 border-black/10';
  if (count <= 4) return 'bg-black/15 border-black/15';
  return 'bg-black/20 border-black/20';
}

export default function MonthlyCountGrid({
  months,
  hrefBase,
}: {
  months: MonthCount[];
  hrefBase: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {months.map((month, index) => (
        <Link
          key={month.key}
          href={`${hrefBase}?month=${encodeURIComponent(month.key)}`}
          className={[
            'group rounded-2xl border p-3 transition',
            'hover:bg-white/80',
            index === 0
              ? 'border-black/40 bg-black/[0.03]'
              : intensityClass(month.count),
          ].join(' ')}
          title={`${month.key}: ${month.count} item(s)`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs text-black/50">
                {month.label} {month.year}
              </div>
              <div className="mt-1 text-lg font-semibold text-black/80">
                {month.count}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

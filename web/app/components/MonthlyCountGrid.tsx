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
            'group relative mt-3 rounded-[1.35rem] border px-3 pb-3 pt-4 transition',
            'hover:bg-white/80 hover:-translate-y-0.5',
            intensityClass(month.count),
          ].join(' ')}
          title={`${month.key}: ${month.count} item(s)`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 flex -translate-y-1/2 justify-center gap-8">
            <span className="h-3.5 w-3.5 rounded-full border border-black/15 bg-[#f8efe8] shadow-sm" />
            <span className="h-3.5 w-3.5 rounded-full border border-black/15 bg-[#f8efe8] shadow-sm" />
          </div>

          <div className="mb-3 border-b border-black/8 pb-2">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/38">
              {month.year}
            </div>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs text-black/50">{month.label}</div>
              <div className="mt-1 text-2xl font-semibold leading-none text-black/80">
                {month.count}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

import Link from 'next/link';
import {
  buildCurrentPlusNonEmptyPastMonths,
  getWorkPublishedDates,
} from '../lib/stats';

function intensityClass(count: number) {
  // cozy heatmap levels (no bright colors)
  if (count <= 0) return 'bg-white/40 border-black/10';
  if (count === 1) return 'bg-black/5 border-black/10';
  if (count === 2) return 'bg-black/10 border-black/10';
  if (count <= 4) return 'bg-black/15 border-black/15';
  return 'bg-black/20 border-black/20';
}

export default async function MonthlyTracker() {
  const dates = await getWorkPublishedDates();
  const months = buildCurrentPlusNonEmptyPastMonths(dates);

  const thisMonth = months[0];
  const totalAllShown = months.reduce((a, m) => a + m.count, 0);

  return (
    <section className="mx-auto max-w-5xl px-4 pt-8">
      <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-start">
          <div>
            <h2 className="mt-2 font-serif text-2xl tracking-tight sm:text-3xl">
              Monthly crochet tracker
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55 sm:text-base">
              How many new unique crochet pieces I made each month.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-sm text-black/60">
            {/* <div className="font-medium text-black/80">{thisMonth.label}:</div>
            <div>
              {thisMonth.count} new piece{thisMonth.count === 1 ? '' : 's'}
            </div> */}
            <div className="text-xs text-black/45">
              Last 12 months: {totalAllShown}
            </div>
          </div>
        </div>

        {/* Tracker grid */}
        <div className="mt-6">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {months.map((m, i) => (
              <Link
                key={m.key}
                href={`/crochets?month=${encodeURIComponent(m.key)}`}
                className={[
                  'group rounded-2xl border p-3 transition',
                  'hover:bg-white/80',
                  i === 0
                    ? 'bg-black/[0.03] border-black/40'
                    : intensityClass(m.count),
                ].join(' ')}
                title={`${m.key}: ${m.count} piece(s)`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-black/50">{m.label}</div>
                    <div className="mt-1 text-lg font-semibold text-black/80">
                      {m.count}
                    </div>
                  </div>

                  {/* tiny “dots” to feel like a tracker */}
                  <div className="mt-1 flex gap-1 opacity-70">
                    {Array.from({ length: Math.min(m.count, 4) }).map(
                      (_, i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-black/35"
                        />
                      ),
                    )}
                    {m.count > 4 ? (
                      <span className="text-xs text-black/40">+</span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-black/40">{m.year}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

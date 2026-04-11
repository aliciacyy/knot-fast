import Link from 'next/link';
import { GarminRun } from '../lib/runs';
import type { MonthCount } from '../lib/stats';
import MonthlyCountGrid from './MonthlyCountGrid';
import RunCard from './RunCard';

export default async function HomeRunsSection({
  runs,
  months,
}: {
  runs: GarminRun[];
  months: MonthCount[];
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="card-float animate-fadeUp rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="max-w-2xl">
            <h3 className="mt-2 font-serif text-3xl tracking-tight text-black/88">
              Running tracker
            </h3>
            <p className="mt-2 text-sm leading-6 text-black/55 sm:text-base">
              Hopefully I can either run 10k or improve my 5K pace to below 6
              minutes.
            </p>
          </div>

          <Link
            href="/runs"
            className="inline-flex w-fit items-center gap-1 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-sm font-medium text-black/70 backdrop-blur hover:bg-white/80"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 font-serif text-2xl tracking-tight text-black/88">
            Number of runs in last 12 months
          </h4>
          <MonthlyCountGrid months={months} hrefBase="/runs" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {runs.map((run) => (
            <RunCard key={run.id} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
}

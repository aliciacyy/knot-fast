import Link from 'next/link';
import CrochetTimeline from './CrochetTimeline';
import MonthlyCountGrid from './MonthlyCountGrid';
import {
  buildCurrentPlusNonEmptyPastMonths,
  getWorkPublishedDates,
} from '../lib/stats';
import type { ProjectCard } from '../lib/queries';

export default async function HomeCrochetSection({
  posts,
}: {
  posts: ProjectCard[];
}) {
  const dates = await getWorkPublishedDates();
  const months = buildCurrentPlusNonEmptyPastMonths(dates);

  return (
    <section className="mx-auto max-w-5xl px-4 pt-8">
      <div className="card-float animate-fadeUp rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="mt-2 font-serif text-2xl tracking-tight sm:text-3xl">
              Crochet tracker
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55 sm:text-base">
              How many new unique crochet pieces I made each month.
            </p>
          </div>

          <Link
            href="/crochets"
            className="inline-flex w-fit items-center gap-1 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-sm font-medium text-black/70 backdrop-blur hover:bg-white/80"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 font-serif text-2xl tracking-tight text-black/88">
            Number of crochets in last 12 months
          </h4>
          <MonthlyCountGrid months={months} hrefBase="/crochets" />
        </div>

        <div className="mt-8">
          <CrochetTimeline posts={posts} />
        </div>
      </div>
    </section>
  );
}

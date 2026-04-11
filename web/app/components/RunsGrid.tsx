'use client';

import { useState } from 'react';
import type { GarminRun } from '../lib/runs';
import RunCard from './RunCard';

const PAGE_SIZE = 9;

export default function RunsGrid({ runs }: { runs: GarminRun[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleRuns = runs.slice(0, visibleCount);
  const hasMore = visibleCount < runs.length;

  return (
    <div className="mt-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleRuns.map((run) => (
          <RunCard key={run.id} run={run} />
        ))}
      </div>

      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-black/72 backdrop-blur transition hover:bg-white/85"
          >
            Load 9 more <span aria-hidden="true">↓</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

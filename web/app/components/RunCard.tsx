import Link from 'next/link';
import { GarminRun } from '../lib/runs';
import {
  formatCompactDate,
  formatDistance,
  formatDuration,
  formatPace,
} from '../lib/runUtils';
import RunRoute from './RunRoute';

export default function RunCard({
  run,
}: {
  run: GarminRun;
}) {
  return (
    <Link
      href={`/runs/${run.id}`}
      className="card-float group flex h-full flex-col rounded-[1.7rem] border border-black/10 bg-white/65 p-4 shadow-sm backdrop-blur hover:bg-white/75"
    >
      <div className="min-h-40 rounded-[1.35rem] bg-[radial-gradient(circle_at_top,rgba(255,235,216,0.72),rgba(255,255,255,0.6))] p-4">
        <div className="flex h-full items-center justify-center">
          <RunRoute
            summaryPolyline={run.map.summary_polyline}
            className="h-28 w-full"
          />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-medium text-black/85">{run.name}</div>
          <div className="mt-1 text-sm text-black/50">
            {formatCompactDate(run.start_date_local)}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-black/42">Distance</div>
          <div className="mt-1 font-medium text-black/82">
            {formatDistance(run.distance)}
          </div>
        </div>
        <div>
          <div className="text-black/42">Pace</div>
          <div className="mt-1 font-medium text-black/82">
            {formatPace(run.distance, run.moving_time)}
          </div>
        </div>
        <div>
          <div className="text-black/42">Time</div>
          <div className="mt-1 font-medium text-black/82">
            {formatDuration(run.moving_time)}
          </div>
        </div>
        <div>
          <div className="text-black/42">Avg HR</div>
          <div className="mt-1 font-medium text-black/82">
            {run.average_heartrate === 0
              ? '-'
              : Math.round(run.average_heartrate) + ' bpm'}
          </div>
        </div>
      </div>
    </Link>
  );
}

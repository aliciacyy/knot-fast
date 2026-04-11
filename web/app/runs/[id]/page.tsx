import { notFound } from 'next/navigation';
import Footer from '../../components/Footer';
import RunRoute from '../../components/RunRoute';
import { getRunById, getRunIds } from '../../lib/runs';
import {
  formatDistance,
  formatDuration,
  formatPace,
  formatRunDate,
  getRunMood,
} from '../../lib/runUtils';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const ids = await getRunIds();
  return ids.map((id) => ({ id: String(id) }));
}

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await getRunById(Number(id));

  if (!run) {
    notFound();
  }

  return (
    <main className="min-h-dvh text-black/90">
      <section className="mx-auto max-w-5xl px-4 pt-2 pb-8 sm:pt-4 sm:pb-10">
        <div className="animate-fadeUp overflow-hidden rounded-3xl border border-black/10 bg-white/60 backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-5 sm:p-6">
              <div className="text-xs font-medium tracking-wider text-black/50">
                RUN DETAIL
              </div>
              <h1 className="mt-2 font-serif text-4xl tracking-tight text-black/90 sm:text-5xl">
                {run.name}
              </h1>
              <p className="mt-3 text-sm leading-6 text-black/55 sm:text-base">
                {formatRunDate(run.start_date_local)}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {[
                  ['Distance', formatDistance(run.distance)],
                  ['Time', formatDuration(run.moving_time)],
                  ['Pace', formatPace(run.distance, run.moving_time)],
                  ['Elevation', `+${run.total_elevation_gain.toFixed(0)} m`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[1.35rem] border border-black/10 bg-white/70 p-4"
                  >
                    <div className="text-xs tracking-wider text-black/45">
                      {label}
                    </div>
                    <div className="mt-2 text-lg font-medium text-black/82">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.7rem] bg-[radial-gradient(circle_at_top,rgba(255,235,216,0.72),rgba(255,255,255,0.6))] p-5">
                <RunRoute
                  summaryPolyline={run.map.summary_polyline}
                  className="h-80 w-full"
                />
              </div>
            </div>

            <div className="border-t border-black/10 p-5 sm:p-6 lg:border-t-0 lg:border-l">
              <div className="rounded-[1.5rem] border border-black/10 bg-white/70 p-5">
                <div className="text-sm font-medium text-black/75">
                  Effort snapshot
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[
                    ['Average heart rate', `${Math.round(run.average_heartrate)} bpm`],
                    ['Max heart rate', `${Math.round(run.max_heartrate)} bpm`],
                    ['Cadence', `${Math.round(run.average_cadence)} spm`],
                    ['Average power', `${Math.round(run.average_watts)} W`],
                    ['Temperature', `${run.average_temp}°C`],
                    ['Mood', getRunMood(run)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[1.2rem] bg-[#fffaf6] p-4">
                      <div className="text-sm text-black/46">{label}</div>
                      <div className="mt-1 font-medium text-black/82">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-black/10 bg-white/65 p-5">
                <div className="text-sm font-medium text-black/75">
                  Route facts
                </div>
                <div className="mt-4 space-y-3 text-sm text-black/60">
                  <p>High point: {run.elev_high.toFixed(1)} m</p>
                  <p>Low point: {run.elev_low.toFixed(1)} m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

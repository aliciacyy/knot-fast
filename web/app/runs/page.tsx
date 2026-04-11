import Footer from '../components/Footer';
import RunsGrid from '../components/RunsGrid';
import runStats from '../data/garmin-run-stats.json';
import { getRuns } from '../lib/runs';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function RunsPage() {
  const runs = await getRuns();

  return (
    <main className="min-h-dvh text-black/90">
      <section className="mx-auto max-w-5xl px-4 pt-2 pb-8 sm:pt-4 sm:pb-10">
        <div className="card-float animate-fadeUp rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="mt-2 font-serif text-4xl tracking-tight text-black/90 sm:text-5xl">
                Run tracker
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55 sm:text-base">
                Hopefully I can either run 10k or improve my 5K pace to below 6
                minutes.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-black/10 bg-white/65 p-5">
              <div className="text-sm font-medium text-black/75">
                Overall stats
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-black/42">Total runs</div>
                  <div className="mt-1 font-medium text-black/82">
                    {runStats.totalRuns}
                  </div>
                </div>
                <div>
                  <div className="text-black/42">Total distance</div>
                  <div className="mt-1 font-medium text-black/82">
                    {runStats.formatted.totalDistanceKilometers}
                  </div>
                </div>
                <div>
                  <div className="text-black/42">Total time</div>
                  <div className="mt-1 font-medium text-black/82">
                    {runStats.formatted.totalTime}
                  </div>
                </div>
                <div>
                  <div className="text-black/42">Average pace</div>
                  <div className="mt-1 font-medium text-black/82">
                    {runStats.formatted.averagePace}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RunsGrid runs={runs} />
        </div>
      </section>

      <Footer />
    </main>
  );
}

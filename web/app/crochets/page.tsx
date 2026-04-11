import CrochetProjectGrid from '../components/CrochetProjectGrid';
import { getRecentProjects } from '../lib/queries';

export const revalidate = 60;

export default async function CrochetsPage() {
  const posts = await getRecentProjects(20);

  return (
    <main className="min-h-dvh">
      <section className="mx-auto max-w-5xl px-4 pt-2 pb-8 sm:pt-4 sm:pb-10">
        <div className="card-float animate-fadeUp rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-6">
          <div className="min-w-0">
            <h1 className="font-serif text-4xl tracking-tight text-black/90 sm:text-5xl">
              Crochets
            </h1>
            <p className="mt-2 text-sm text-black/55 sm:text-base">
              Documenting my crochet journey, one stitch at a time.
            </p>
          </div>

          <CrochetProjectGrid posts={posts} />
        </div>
      </section>
    </main>
  );
}

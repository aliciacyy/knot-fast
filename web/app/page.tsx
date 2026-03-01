import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedWork, getRecentWorks } from './lib/queries';
import { urlForImage } from './lib/image';
import MonthlyTracker from './components/MonthlyTracker';
import Footer from './components/Footer';
import Hero from './components/Hero';

export const revalidate = 60;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    getFeaturedWork(),
    getRecentWorks(6),
  ]);

  return (
    <main className="min-h-dvh text-black/90">
      {/* HERO */}
      <Hero />

      <MonthlyTracker />

      {/* FEATURED */}
      {/* <section className="animate-fadeUp mx-auto max-w-5xl px-4 pt-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/60 backdrop-blur">
          <div className="p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-medium tracking-wider text-black/50">
                  FEATURED
                </div>
                <h2 className="mt-2 font-serif text-2xl tracking-tight sm:text-3xl">
                  {featured?.title ?? 'Pin a featured piece'}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55 sm:text-base">
                  {featured?.excerpt ??
                    'In Sanity Studio, toggle “Featured” on a Work to make it appear here automatically.'}
                </p>
              </div>

              <Link
                href={
                  featured ? `/crochets/${featured.slug.current}` : '/crochets'
                }
                className="hidden rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-medium text-black/75 hover:bg-white sm:inline-flex"
              >
                Open →
              </Link>
            </div>
          </div>

          <div className="bg-black/5">
            {featured?.coverImage ? (
              <div className="relative aspect-[16/10]">
                <Image
                  src={urlForImage(featured.coverImage)
                    .width(2000)
                    .height(1250)
                    .quality(85)
                    .url()}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center text-sm text-black/45">
                Add a cover image to your featured work
              </div>
            )}
          </div>

          <div className="p-5 sm:hidden">
            <Link
              href={
                featured ? `/crochets/${featured.slug.current}` : '/crochets'
              }
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"
            >
              Open featured piece
            </Link>
          </div>
        </div>
      </section> */}

      {/* UP FOR ORDERS */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl tracking-tight">Up for sale</h3>
            <p className="mt-2 text-sm text-black/55 sm:text-base">
              Pieces for sale or up for pre-orders (limited quanities).
            </p>
          </div>
          <Link
            href="/crochets"
            className="text-sm font-medium text-black/70 hover:text-black/90"
          >
            View all →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((w) => (
            <Link
              key={w._id}
              href={`/crochets/${w.slug.current}`}
              className="group overflow-hidden rounded-3xl border border-black/10 bg-white/60 backdrop-blur hover:bg-white/70"
            >
              <div className="relative aspect-[4/3] bg-black/5">
                {w.coverImage ? (
                  <Image
                    src={urlForImage(w.coverImage)
                      .width(1200)
                      .height(900)
                      .quality(80)
                      .url()}
                    alt={w.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : null}
              </div>

              <div className="p-4">
                <div className="text-xs text-black/45">
                  {formatDate(w.publishedAt)}
                </div>
                <div className="mt-1 font-medium text-black/85">{w.title}</div>
                {w.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">
                    {w.excerpt}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}

          {!recent.length ? (
            <div className="rounded-3xl border border-black/10 bg-white/60 p-6 text-black/60">
              No works yet. Add your first{' '}
              <span className="font-medium">Work</span> in Sanity Studio and
              publish it ✨
            </div>
          ) : null}
        </div>
      </section>

      {/* RECENT */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl tracking-tight">
              Recent pieces
            </h3>
            <p className="mt-2 text-sm text-black/55 sm:text-base">
              The latest makes, ready to browse.
            </p>
          </div>
          <Link
            href="/crochets"
            className="text-sm font-medium text-black/70 hover:text-black/90"
          >
            View all →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((w) => (
            <Link
              key={w._id}
              href={`/crochets/${w.slug.current}`}
              className="group overflow-hidden rounded-3xl border border-black/10 bg-white/60 backdrop-blur hover:bg-white/70"
            >
              <div className="relative aspect-[4/3] bg-black/5">
                {w.coverImage ? (
                  <Image
                    src={urlForImage(w.coverImage)
                      .width(1200)
                      .height(900)
                      .quality(80)
                      .url()}
                    alt={w.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : null}
              </div>

              <div className="p-4">
                <div className="text-xs text-black/45">
                  {formatDate(w.publishedAt)}
                </div>
                <div className="mt-1 font-medium text-black/85">{w.title}</div>
                {w.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">
                    {w.excerpt}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}

          {!recent.length ? (
            <div className="rounded-3xl border border-black/10 bg-white/60 p-6 text-black/60">
              No works yet. Add your first{' '}
              <span className="font-medium">Work</span> in Sanity Studio and
              publish it ✨
            </div>
          ) : null}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}

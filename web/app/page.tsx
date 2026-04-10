import Link from 'next/link';
import { getRecentProjects } from './lib/queries';
import MonthlyTracker from './components/MonthlyTracker';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CrochetTimeline from './components/CrochetTimeline';

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getRecentProjects(6);

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
      {/* <section className="mx-auto max-w-5xl px-4 pt-8">
        <div className="card-float animate-fadeUp rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h3 className="font-serif text-3xl tracking-tight">Shop</h3>
              <p className="mt-2 text-sm text-black/55 sm:text-base">
                Pieces for sale or up for pre-orders.
              </p>
            </div>

            <Link
              href="/crochets"
              className="inline-flex w-fit items-center gap-1 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-sm font-medium text-black/70 backdrop-blur hover:bg-white/80"
            >
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((w) => (
              <Link
                key={w._id}
                href={`/products/${w.slug.current}`}
                className="card-float group overflow-hidden rounded-3xl border border-black/10 bg-white/55 shadow-sm backdrop-blur hover:bg-white/70 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-black/5">
                  {w.images ? (
                    <Image
                      src={urlForImage(w.images[0])
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
                  <div className="mt-1 font-medium text-black/85">
                    {w.title}
                  </div>
                  {w.variants ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">
                      Prices from ${w.variants[0].price}
                    </p>
                  ) : (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">
                      No price yet!
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* RECENT */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="card-float animate-fadeUp rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h3 className="font-serif text-3xl tracking-tight">Crochets</h3>
              <p className="mt-2 text-sm text-black/55 sm:text-base">
                Documenting my crochet journey, one stitch at a time.
              </p>
            </div>

            <Link
              href="/crochets"
              className="inline-flex w-fit items-center gap-1 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-sm font-medium text-black/70 backdrop-blur hover:bg-white/80"
            >
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-8">
            <CrochetTimeline posts={projects} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}

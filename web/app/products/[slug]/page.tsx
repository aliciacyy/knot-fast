import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { urlForImage } from '@/app/lib/image';
import { getProductBySlug, getPostSlugs } from '@/app/lib/queries';

export const revalidate = 60;

function formatPrice(value?: number, currency = 'SGD') {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    // fallback if currency code is unexpected
    return `${currency} ${value}`;
  }
}

function getAvailabilityLabel(status?: string) {
  if (status === 'active')
    return {
      text: 'Available',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  if (status === 'soldOut')
    return {
      text: 'Sold out',
      className: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  if (status === 'archived')
    return {
      text: 'Archived',
      className: 'bg-zinc-50 text-zinc-700 border-zinc-200',
    };
  return {
    text: 'Draft',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  };
}

function computeFromVariants(variants?: any[]) {
  const safe = Array.isArray(variants) ? variants : [];
  const prices = safe
    .map((v) => v?.price)
    .filter((n) => typeof n === 'number') as number[];
  const currencies = safe.map((v) => v?.currency).filter(Boolean) as string[];
  const currency = currencies[0] ?? 'SGD';
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;

  const totalQty = safe
    .map((v) => v?.quantity)
    .filter((n) => typeof n === 'number') as number[];
  const inStock = totalQty.some((q) => q > 0);

  return { currency, minPrice, maxPrice, inStock };
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage = images[0] ?? null;
  const { currency, minPrice, maxPrice, inStock } = computeFromVariants(
    product.variants,
  );

  const priceText =
    minPrice == null
      ? null
      : minPrice === maxPrice
        ? formatPrice(minPrice, currency)
        : `${formatPrice(minPrice, currency)} – ${formatPrice(maxPrice!, currency)}`;

  const badge = getAvailabilityLabel(product.status);

  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/" className="text-sm text-black/60 hover:text-black/80">
          ← Back to home
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <section>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-black/5 bg-black/5">
              {primaryImage ? (
                <Image
                  src={urlForImage(primaryImage)
                    .width(1600)
                    .height(1600)
                    .quality(85)
                    .url()}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-black/5 bg-black/5"
                    title="Gallery image"
                  >
                    <Image
                      src={urlForImage(img)
                        .width(600)
                        .height(600)
                        .quality(80)
                        .url()}
                      alt={`${product.title} image ${idx + 2}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {/* Purchase panel */}
          <section className="lg:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${badge.className}`}
              >
                {badge.text}
              </span>
              {product.madeToOrder ? (
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-black/70">
                  Made to order
                  {typeof product.leadTimeDays === 'number'
                    ? ` • ${product.leadTimeDays}d`
                    : ''}
                </span>
              ) : null}
              {product.featured ? (
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-black/70">
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black/90">
              {product.title}
            </h1>

            {priceText ? (
              <div className="mt-2 text-lg font-medium text-black/80">
                {priceText}
              </div>
            ) : (
              <div className="mt-2 text-sm text-black/60">
                Price available in variants
              </div>
            )}

            {product.description ? (
              <p className="mt-4 text-base leading-7 text-black/65 whitespace-pre-line">
                {product.description}
              </p>
            ) : null}

            {/* Variants */}
            {Array.isArray(product.variants) && product.variants.length ? (
              <div className="mt-8">
                <h2 className="text-sm font-semibold tracking-tight text-black/90">
                  Choose a variant
                </h2>

                <div className="mt-3 grid gap-3">
                  {product.variants.map((v: any, idx: number) => {
                    const vPrice = formatPrice(
                      v?.price,
                      v?.currency ?? currency,
                    );
                    const qty =
                      typeof v?.quantity === 'number' ? v.quantity : null;
                    const soldOut = qty != null ? qty <= 0 : !inStock;

                    return (
                      <div
                        key={v?.sku ?? `${v?.name ?? 'variant'}-${idx}`}
                        className={`flex items-center gap-3 rounded-2xl border bg-white/60 p-3 shadow-sm backdrop-blur ${
                          soldOut
                            ? 'border-black/5 opacity-70'
                            : 'border-black/10'
                        }`}
                      >
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-black/5">
                          {v?.image ? (
                            <Image
                              src={urlForImage(v.image)
                                .width(300)
                                .height(300)
                                .quality(80)
                                .url()}
                              alt={v?.name ?? product.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-black/90">
                            {v?.name ?? 'Variant'}
                          </div>
                          <div className="mt-0.5 text-sm text-black/60">
                            {vPrice ?? '—'}
                            {qty != null ? ` • ${qty} left` : ''}
                          </div>
                        </div>

                        <div className="text-xs text-black/50">
                          {soldOut ? 'Sold out' : 'In stock'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* CTA (non-checkout placeholder) */}
            <div className="mt-8 rounded-3xl border border-black/5 bg-white/60 p-4 shadow-sm backdrop-blur">
              <div className="text-sm font-medium text-black/90">
                Interested in this?
              </div>
              <div className="mt-1 text-sm text-black/60">
                This page is ready for a checkout button later. For now, you can
                link to your preferred contact method.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:hello@example.com?subject=${encodeURIComponent(`Order inquiry: ${product.title}`)}&body=${encodeURIComponent(
                    `Hi! I'm interested in "${product.title}".\n\nVariant (if any): \nQuantity: \n\nThanks!`,
                  )}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
                >
                  Email to order
                </a>

                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-black/80 hover:bg-white"
                >
                  Browse more →
                </Link>
              </div>
            </div>

            {/* Related products (optional) */}
            {product.relatedProducts?.length ? (
              <section className="mt-10">
                <h2 className="text-sm font-semibold tracking-tight text-black/90">
                  You might also like
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {product.relatedProducts.map((p: any) => (
                    <Link
                      key={p._id}
                      href={`/products/${p.slug.current}`}
                      className="group rounded-2xl border border-black/5 bg-white/60 p-3 shadow-sm backdrop-blur transition hover:shadow-md"
                    >
                      <div className="flex gap-3">
                        <div className="relative h-20 w-24 flex-none overflow-hidden rounded-xl bg-black/5">
                          {p.images ? (
                            <Image
                              src={urlForImage(p.images)
                                .width(800)
                                .height(600)
                                .quality(80)
                                .url()}
                              alt={p.title}
                              fill
                              className="object-cover transition duration-300 group-hover:scale-[1.02]"
                              sizes="96px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-black/90">
                            {p.title}
                          </div>
                          <div className="mt-1 text-sm text-black/60">
                            View product →
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}

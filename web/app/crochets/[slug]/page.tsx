import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PortableText from '@/app/components/PortableText';
import { urlForImage } from '@/app/lib/image';
import { getProjectBySlug, getPostSlugs } from '@/app/lib/queries';

export const revalidate = 60;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getProjectBySlug(slug);

  if (!post) notFound();

  return (
    <main className="min-h-dvh">
      <article className="mx-auto max-w-3xl px-4 py-12">
        <header className="space-y-4">
          <Link href="/" className="text-sm text-black/60 hover:text-black/80">
            ← Back to home
          </Link>

          <div className="text-xs text-black/50">
            {formatDate(post.publishedAt)}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-black/90">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="text-base leading-7 text-black/60">{post.excerpt}</p>
          ) : null}

          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((t: string) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-black/60 hover:bg-white"
                >
                  {t}
                </Link>
              ))}
            </div>
          ) : null}

          {post.coverImage ? (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-black/5">
              <Image
                src={urlForImage(post.coverImage)
                  .width(2000)
                  .height(1125)
                  .quality(85)
                  .url()}
                alt={post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          ) : null}
        </header>

        <section className="prose prose-neutral mt-10 max-w-none">
          <PortableText value={post.body} />
        </section>

        {/* Optional related works */}
        {post.relatedWorks?.length ? (
          <section className="mt-12">
            <h2 className="text-lg font-semibold tracking-tight text-black/90">
              Related works
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {post.relatedWorks.map((w: any) => (
                <Link
                  key={w._id}
                  href={`/works/${w.slug.current}`}
                  className="group rounded-2xl border border-black/5 bg-white/60 p-3 shadow-sm backdrop-blur transition hover:shadow-md"
                >
                  <div className="flex gap-3">
                    <div className="relative h-20 w-28 flex-none overflow-hidden rounded-xl bg-black/5">
                      {w.coverImage ? (
                        <Image
                          src={urlForImage(w.coverImage)
                            .width(800)
                            .height(600)
                            .quality(80)
                            .url()}
                          alt={w.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                          sizes="112px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-black/90">
                        {w.title}
                      </div>
                      <div className="mt-1 text-sm text-black/60">
                        View piece →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}

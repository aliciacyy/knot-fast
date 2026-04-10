import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '../lib/image';

type PostCardProps = {
  post: {
    title: string;
    slug: { current: string };
    publishedAt: string;
    excerpt?: string;
    coverImage?: any;
    tags?: string[];
  };
};

function formatDate(iso: string) {
  const d = new Date(iso);
  // looks good for SG locale too
  return d.toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default function PostCard({ post }: PostCardProps) {
  const href = `/crochets/${post.slug.current}`;

  return (
    <article className="group rounded-2xl border border-black/5 bg-white/60 p-4 shadow-sm backdrop-blur transition hover:shadow-md">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/5">
          {post.coverImage ? (
            <Image
              src={urlForImage(post.coverImage)
                .width(1200)
                .height(900)
                .quality(85)
                .url()}
              alt={post.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-black/40">
              No image
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-xs text-black/50">
            {formatDate(post.publishedAt)}
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-black/90">
            {post.title}
          </h2>

          {post.excerpt ? (
            <p className="line-clamp-3 text-sm leading-6 text-black/60">
              {post.excerpt}
            </p>
          ) : null}

          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-black/60"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

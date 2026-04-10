import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '../lib/image';
import type { ProjectCard } from '../lib/queries';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default function CrochetProjectGrid({
  posts,
}: {
  posts: ProjectCard[];
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/crochets/${post.slug.current}`}
          className="card-float group overflow-hidden rounded-3xl border border-black/10 bg-white/55 shadow-sm backdrop-blur hover:bg-white/70 hover:shadow-md"
        >
          <div className="relative aspect-[4/3] bg-black/5">
            {post.coverImage ? (
              <Image
                src={urlForImage(post.coverImage)
                  .width(1200)
                  .height(900)
                  .quality(80)
                  .url()}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : null}
          </div>

          <div className="p-4">
            <div className="text-xs text-black/45">
              {formatDate(post.publishedAt)}
            </div>
            <div className="mt-1 font-medium text-black/85">{post.title}</div>
            {post.excerpt ? (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">
                {post.excerpt}
              </p>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}

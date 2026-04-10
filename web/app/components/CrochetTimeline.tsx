import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '../lib/image';
import type { ProjectCard } from '../lib/queries';

function formatTimelineDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-SG', {
    month: 'short',
    day: 'numeric',
  });
}

function formatTimelineMonth(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-SG', {
    month: 'short',
    year: 'numeric',
  });
}

function groupPostsByMonth(posts: ProjectCard[]) {
  return posts.reduce<
    Array<{
      key: string;
      label: string;
      posts: Array<{ post: ProjectCard; index: number }>;
    }>
  >((groups, post, index) => {
    const d = new Date(post.publishedAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const existingGroup = groups.find((group) => group.key === key);

    if (existingGroup) {
      existingGroup.posts.push({ post, index });
      return groups;
    }

    groups.push({
      key,
      label: formatTimelineMonth(post.publishedAt),
      posts: [{ post, index }],
    });

    return groups;
  }, []);
}

function TimelineCard({
  post,
  index,
}: {
  post: ProjectCard;
  index: number;
}) {
  const isRight = index % 2 === 1;

  return (
    <article className={`crochet-timeline-item ${isRight ? 'right' : 'left'}`}>
      <div className="crochet-timeline-date" aria-label="Published date">
        <strong>{formatTimelineDate(post.publishedAt)}</strong>
      </div>

      <div className="crochet-timeline-card-wrap">
        <Link
          href={`/crochets/${post.slug.current}`}
          className="group block overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur transition hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-5"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#eaded4]">
            {post.coverImage ? (
              <Image
                src={urlForImage(post.coverImage)
                  .width(1200)
                  .height(900)
                  .quality(85)
                  .url()}
                alt={post.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.25em] text-black/35">
                No image yet
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/18 via-black/0 to-transparent" />
          </div>

          <div className="mt-4">
            <h2 className="font-serif text-3xl tracking-tight text-black/90">
              {post.title}
            </h2>

            {post.excerpt ? (
              <p className="mt-3 text-sm leading-7 text-black/60">
                {post.excerpt}
              </p>
            ) : null}

            {post.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-white/85 px-3 py-1 text-xs text-black/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-5 border-t border-black/8 pt-4 text-right">
              <span className="inline-flex text-sm font-medium text-black/70 transition group-hover:translate-x-1">
                Read story →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
}

export default function CrochetTimeline({ posts }: { posts: ProjectCard[] }) {
  const monthGroups = groupPostsByMonth(posts);

  if (!posts.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-black/10 bg-white/40 px-6 py-20 text-center text-black/50">
        No crochet stories yet.
      </div>
    );
  }

  return (
    <div className="crochet-main-timeline">
      {monthGroups.map((group) => (
        <section key={group.key} className="crochet-timeline-month">
          <h2 className="crochet-timeline-month-label">{group.label}</h2>

          {group.posts.map(({ post, index }) => (
            <TimelineCard key={post._id} post={post} index={index} />
          ))}
        </section>
      ))}
    </div>
  );
}

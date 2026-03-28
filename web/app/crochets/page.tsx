import PostCard from '../components/PostCard';
import { getWorks, getAllWorkTags } from '../lib/queries';

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams; // 👈 FIX HERE

  const [posts, tags] = await Promise.all([getWorks(), getAllWorkTags()]);

  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-black/90">
          Recent works
        </h1>

        {/* Tag filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href="/blog"
            className={
              !tag
                ? 'bg-black text-white px-3 py-1 rounded-full'
                : 'border px-3 py-1 rounded-full'
            }
          >
            All
          </a>

          {tags.map((t) => (
            <a
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={
                t === tag
                  ? 'bg-black text-white px-3 py-1 rounded-full'
                  : 'border px-3 py-1 rounded-full'
              }
            >
              {t}
            </a>
          ))}
        </div>

        {/* Posts */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p: any) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      </div>
    </main>
  );
}

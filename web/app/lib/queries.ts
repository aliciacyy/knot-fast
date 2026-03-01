import { SanityDocument } from 'next-sanity';
import { sanityClient } from './sanityClient';

const WORK_QUERY = `*[_type=="work" && defined(slug.current)]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    coverImage,
    tags
  }`;

const options = { next: { revalidate: 30 } };

export async function getWorks() {
  return sanityClient.fetch<SanityDocument[]>(WORK_QUERY, {}, options);
}

export async function getAllWorkTags(): Promise<string[]> {
  const query = `
    array::unique(*[_type == "work" && defined(tags)].tags[])
    | order(@ asc)
  `;
  return sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
}

export async function getWorkBySlug(slug: string) {
  const query = `
    *[_type=="work" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      coverImage,
      tags,
      body,
      relatedWorks[]->{
        _id,
        title,
        slug,
        coverImage
      }
    }
  `;
  return sanityClient.fetch(query, { slug }, { next: { revalidate: 60 } });
}

export async function getPostSlugs(): Promise<string[]> {
  const query = `*[_type=="post" && defined(slug.current)].slug.current`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
}

export type WorkCard = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  coverImage: any;
  tags?: string[];
};

export async function getFeaturedWork(): Promise<WorkCard | null> {
  const query = `
    *[_type=="work" && defined(slug.current) && featured == true]
    | order(publishedAt desc)[0]{
      _id, title, slug, publishedAt, excerpt, coverImage, tags
    }
  `;
  return sanityClient.fetch(query, {}, { next: { revalidate: 60 } });
}

export async function getRecentWorks(limit = 6): Promise<WorkCard[]> {
  const query = `
    *[_type=="work" && defined(slug.current)]
    | order(publishedAt desc)[0...$limit]{
      _id, title, slug, publishedAt, excerpt, coverImage, tags
    }
  `;
  return sanityClient.fetch(query, { limit }, { next: { revalidate: 60 } });
}

import { SanityDocument } from 'next-sanity';
import { sanityClient } from './sanityClient';

const POSTS_QUERY = `*[_type=="post" && defined(slug.current)]
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

export async function getPosts() {
  return sanityClient.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
}

export async function getAllPostTags(): Promise<string[]> {
  const query = `
    array::unique(*[_type == "post" && defined(tags)].tags[])
    | order(@ asc)
  `;
  return sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
}

export async function getPostBySlug(slug: string) {
  const query = `
    *[_type=="post" && slug.current == $slug][0]{
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

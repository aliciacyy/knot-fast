import Link from 'next/link';
import Image from 'next/image';
import { PortableText as PT } from '@portabletext/react';
import { urlForImage } from '../lib/image';

function isExternal(href: string) {
  try {
    const u = new URL(href);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

const components = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="mt-10 text-3xl font-semibold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-8 text-xl font-semibold tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-6 border-l-2 border-black/20 pl-4 italic text-black/70">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="my-4 leading-7 text-black/80">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-black/80">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-black/80">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-7">{children}</li>,
    number: ({ children }: any) => <li className="leading-7">{children}</li>,
  },
  marks: {
    link: ({ children, value }: any) => {
      const href = value?.href as string | undefined;
      if (!href) return children;

      if (isExternal(href)) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-black/30 underline-offset-4 hover:decoration-black/60"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="underline decoration-black/30 underline-offset-4 hover:decoration-black/60"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-semibold text-black/90">{children}</strong>
    ),
    em: ({ children }: any) => <em className="text-black/80">{children}</em>,
    code: ({ children }: any) => (
      <code className="rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-sm text-black/80">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }: any) => {
      if (!value) return null;
      const url = urlForImage(value).width(1600).quality(85).url();
      return (
        <figure className="my-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black/5">
            <Image
              src={url}
              alt={value?.alt ?? ''}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {value?.alt ? (
            <figcaption className="mt-2 text-sm text-black/50">
              {value.alt}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export default function PortableText({ value }: { value: any }) {
  if (!value) return null;
  return <PT value={value} components={components as any} />;
}

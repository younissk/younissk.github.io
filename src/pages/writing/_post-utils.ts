/**
 * Shared query + formatting helpers for the writing section.
 *
 * Underscore-prefixed so Astro does not route it. Everything that needs the
 * post list — index, detail, tag pages, RSS — goes through `getPosts()` so the
 * draft filter and the sort order are defined exactly once.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Published posts, newest first. Drafts never ship. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** URL-safe form of a tag, used for /writing/tags/<slug>/. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** `2023-07-09` — the machine-readable value for <time datetime>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** `9 Jul 2023` — compact, fits a monospace column in a long list. */
export function shortDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** `9 July 2023` — the detail-page byline. */
export function longDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** RFC 822 date, as RSS 2.0 requires for pubDate. */
export function rfc822Date(date: Date): string {
  return date.toUTCString();
}

/** Human name for a language code, for the index marker and the detail meta. */
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
};

export function languageName(lang: string): string {
  return LANGUAGE_NAMES[lang] ?? lang.toUpperCase();
}

/**
 * RSS 2.0 feed for the writing section.
 *
 * Hand-written rather than generated: `@astrojs/rss` is not a dependency of
 * this project and adding one is out of scope, so this endpoint emits the XML
 * directly. It stays a plain RSS 2.0 document with the Atom self-link and
 * Dublin Core creator extensions, which every reader understands.
 *
 * Every URL is absolute and built from SITE_URL, as the spec requires — a feed
 * is read outside the origin, so root-relative links would break.
 */
import type { APIRoute } from 'astro';
import { AUTHOR, RSS_PATH, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../consts';
import { getPosts, rfc822Date, tagSlug } from './writing/_post-utils';

export const prerender = true;

/** Absolute URL for a root-relative path. */
const abs = (path: string): string => new URL(path, SITE_URL).href;

/** Escape the five XML-significant characters. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = await getPosts();

  const lastBuild = posts.length ? posts[0].data.date : new Date();

  const items = posts
    .map((post) => {
      const url = abs(`/writing/${post.id}/`);
      const categories = post.data.tags
        .map(
          (tag) =>
            `      <category domain="${esc(abs(`/writing/tags/${tagSlug(tag)}/`))}">${esc(tag)}</category>`,
        )
        .join('\n');

      return [
        '    <item>',
        `      <title>${esc(post.data.title)}</title>`,
        `      <link>${esc(url)}</link>`,
        `      <guid isPermaLink="true">${esc(url)}</guid>`,
        `      <pubDate>${rfc822Date(post.data.date)}</pubDate>`,
        `      <description>${esc(post.data.description)}</description>`,
        `      <dc:creator>${esc(AUTHOR.name)}</dc:creator>`,
        `      <dc:language>${esc(post.data.lang)}</dc:language>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE_TITLE)} — Writing</title>
    <link>${esc(abs('/writing/'))}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <copyright>© ${new Date().getUTCFullYear()} ${esc(AUTHOR.name)}</copyright>
    <managingEditor>${esc(`${AUTHOR.email} (${AUTHOR.name})`)}</managingEditor>
    <webMaster>${esc(`${AUTHOR.email} (${AUTHOR.name})`)}</webMaster>
    <lastBuildDate>${rfc822Date(lastBuild)}</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>Astro</generator>
    <atom:link href="${esc(abs(RSS_PATH))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../consts';
import { VIDEOS, videoHref } from '../lib/videos';

/**
 * llms.txt — a curated map of this site for language models.
 *
 * Generated from the same collections the pages are built from, so it cannot
 * drift the way a hand-written copy would. A new project or paper appears here
 * on the next build with no separate step to forget.
 *
 * Why it exists: the home page is deliberately bare — a name, a search box and
 * three links — so a model that fetches it finds nothing quotable about whose
 * site this is. This file is where that answer lives instead, without putting a
 * biography on a page that is meant to stay quiet.
 *
 * Single given name only, throughout. The full name appears on the three paper
 * pages, where an accurate author list belongs, and nowhere else by choice.
 */

const abs = (path: string) => new URL(path, SITE_URL).href;

const INTRO = [
  '# Youniss',
  '',
  '> Applied AI engineer. I work on retrieval that has to stay current and on',
  '> agents whose behaviour has to be checkable rather than trusted. BSc in',
  '> Artificial Intelligence from JKU, with a thesis on audio-text retrieval that',
  '> reports a negative result. I publish the things that did not work as well as',
  '> the things that did, I make videos explaining machine learning, and I ship',
  '> small tools end to end rather than stopping at a notebook.',
  '',
  'This site is static HTML. No page needs JavaScript to be read, nothing is',
  'behind a paywall or a login, and there is no tracking of any kind.',
  'Content is CC BY 4.0; code is MIT.',
  '',
];

export const GET: APIRoute = async () => {
  const [papers, posts, projects] = await Promise.all([
    getCollection('papers'),
    getCollection('posts', ({ data }) => !data.draft),
    getCollection('projects'),
  ]);

  const lines = [...INTRO];

  lines.push('## Pages', '');
  lines.push(`- [Projects](${abs('/projects/')}): the full archive, filterable by category and stack`);
  lines.push(`- [Library](${abs('/library/')}): writing, papers and videos in one list, newest first`);
  lines.push(`- [Writing](${abs('/writing/')}): posts only`);
  lines.push(`- [Papers](${abs('/papers/')}): publications only, each with an abstract and BibTeX`);
  lines.push(`- [Videos](${abs('/videos/')}): the video archive`);
  lines.push(`- [Now](${abs('/now/')}): what I am working on, studying and building at the moment`);
  lines.push(`- [Uses](${abs('/uses/')}): the languages, frameworks and infrastructure I actually work in`);
  lines.push(`- [Contact](${abs('/contact/')}): a form, which is the only reliable channel`);
  lines.push('');

  lines.push('## Papers', '');
  for (const p of [...papers].sort((a, b) => b.data.year - a.data.year)) {
    lines.push(
      `- [${p.data.title}](${abs(`/papers/${p.id}/`)}): ${p.data.venue}, ${p.data.year}.`,
    );
  }
  lines.push('');

  lines.push('## Projects', '');
  for (const p of [...projects].sort((a, b) => (b.data.year ?? 0) - (a.data.year ?? 0))) {
    lines.push(`- [${p.data.title}](${abs(`/projects/${p.id}/`)}): ${p.data.summary}`);
  }
  lines.push('');

  lines.push('## Writing', '');
  for (const p of [...posts].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  )) {
    const lang = p.data.lang === 'de' ? ' (German)' : '';
    lines.push(`- [${p.data.title}](${abs(`/writing/${p.id}/`)})${lang}: ${p.data.description}`);
  }
  lines.push('');

  lines.push('## Optional', '');
  lines.push(`Video archive, ${VIDEOS.length} entries, newest first:`);
  lines.push('');
  for (const v of [...VIDEOS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 15)) {
    lines.push(`- [${v.title}](${abs(videoHref(v.id))}) — ${v.publishedAt.slice(0, 10)}`);
  }
  lines.push(`- [...and ${Math.max(0, VIDEOS.length - 15)} more](${abs('/videos/')})`);
  lines.push('');
  lines.push(`- [RSS feed](${abs('/rss.xml')}) for the written work`);
  lines.push(`- [Sitemap](${abs('/sitemap-index.xml')}) for everything`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

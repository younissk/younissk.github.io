import { getCollection } from 'astro:content';
import { videoHref, VIDEOS } from './videos';

export interface SearchEntry {
  /** Route to navigate to. */
  href: string;
  title: string;
  /** Shown under the title. Kept short — this is a list, not a page. */
  detail: string;
  /** Section label, rendered as a monospace chip. */
  group: string;
  /** Extra words that should match but need not be displayed. */
  keywords: string;
}

/**
 * Static routes that have no collection behind them.
 *
 * Nothing here may carry a surname or a place name. This index is inlined into
 * the HTML of EVERY page, so a keyword added for one entry's benefit ends up in
 * the source of the contact page and the uses page too. That is how the full
 * name previously reached all 69 pages from a single line on the home entry.
 */
const PAGES: SearchEntry[] = [
  { href: '/', title: 'Home', detail: 'Start here', group: 'page', keywords: 'youniss home start' },
  { href: '/now/', title: 'Now', detail: 'What I am doing at the moment', group: 'page', keywords: 'current' },
  { href: '/uses/', title: 'Uses', detail: 'The stack I actually work in', group: 'page', keywords: 'setup tools stack' },
  { href: '/contact/', title: 'Contact', detail: 'Send me a message', group: 'page', keywords: 'email get in touch hire' },
  { href: '/projects/', title: 'Projects', detail: 'The full archive', group: 'page', keywords: 'repositories github' },
  { href: '/library/', title: 'Library', detail: 'Writing, papers and videos', group: 'page', keywords: 'blog posts publications youtube' },
  { href: '/writing/', title: 'Writing', detail: 'Posts, newest first', group: 'page', keywords: 'blog articles' },
  { href: '/papers/', title: 'Papers', detail: 'Publications, with BibTeX', group: 'page', keywords: 'publications research thesis' },
  { href: '/videos/', title: 'Videos', detail: 'The video archive', group: 'page', keywords: 'youtube talks explainers' },
];

/** First sentence of a video description, minus links and chapter timestamps. */
function videoKeywords(description: string): string {
  return description
    .split('\n')
    .filter((line) => !/^\s*\d+:\d+/.test(line) && !/https?:\/\//.test(line))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

/**
 * Everything on the site, flattened into one list for the command palette.
 *
 * Built at build time and handed to the island as a prop, so there is no
 * search endpoint, no index file to keep in sync and nothing fetched at
 * runtime. It costs a few KB in the page and works offline.
 */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [projects, papers, posts] = await Promise.all([
    getCollection('projects'),
    getCollection('papers'),
    getCollection('posts', ({ data }) => !data.draft),
  ]);

  return [
    ...PAGES,
    ...projects.map((e) => ({
      href: `/projects/${e.id}/`,
      title: e.data.title,
      detail: e.data.summary,
      group: 'project',
      keywords: [e.data.repoName, e.data.category, ...e.data.tags, ...e.data.stack].join(' '),
    })),
    /* Author names and the venue string stay OUT of this index — the venue
       carries the university's city, and both would be inlined site-wide. The
       paper pages themselves still show the full author list, which is where an
       accurate citation belongs. */
    ...papers.map((e) => ({
      href: `/papers/${e.id}/`,
      title: e.data.title,
      detail: `${e.data.type.replace(/-/g, ' ')} · ${e.data.year}`,
      group: 'paper',
      keywords: e.data.type,
    })),
    ...posts.map((e) => ({
      href: `/writing/${e.id}/`,
      title: e.data.title,
      detail: e.data.description,
      group: 'writing',
      keywords: e.data.tags.join(' '),
    })),
    /* Videos come from src/data/videos.json, not from a content collection.
       The collection holds only optional hand-written extras and is empty, so
       indexing it produced zero video results and titled them by raw id. */
    ...VIDEOS.map((v) => ({
      href: videoHref(v.id),
      title: v.title,
      detail: v.publishedAt.slice(0, 10),
      group: 'video',
      keywords: videoKeywords(v.description),
    })),
  ];
}

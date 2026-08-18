import { getCollection } from 'astro:content';

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

/** Static routes that have no collection behind them. */
const PAGES: SearchEntry[] = [
  { href: '/', title: 'Home', detail: 'Start here', group: 'page', keywords: 'youniss kandah' },
  { href: '/about/', title: 'About', detail: 'Paramedic, construction, AI', group: 'page', keywords: 'bio background story' },
  { href: '/cv/', title: 'CV', detail: 'Roles, education, skills', group: 'page', keywords: 'resume curriculum vitae experience' },
  { href: '/now/', title: 'Now', detail: 'What I am doing at the moment', group: 'page', keywords: 'current' },
  { href: '/uses/', title: 'Uses', detail: 'The stack I actually work in', group: 'page', keywords: 'setup tools stack' },
  { href: '/contact/', title: 'Contact', detail: 'Send me a message', group: 'page', keywords: 'email get in touch hire' },
  { href: '/work/', title: 'Work', detail: 'Case studies', group: 'page', keywords: 'experience' },
  { href: '/projects/', title: 'Projects', detail: 'The full archive', group: 'page', keywords: 'repositories github' },
  { href: '/papers/', title: 'Papers', detail: 'Publications and reports', group: 'page', keywords: 'research publications bibtex' },
  { href: '/writing/', title: 'Writing', detail: 'Notes and essays', group: 'page', keywords: 'blog posts' },
  { href: '/videos/', title: 'Videos', detail: 'YouTube, indexed', group: 'page', keywords: 'youtube' },
];

/**
 * Everything on the site, flattened into one list for the command palette.
 *
 * Built at build time and handed to the island as a prop, so there is no
 * search endpoint, no index file to keep in sync and nothing fetched at
 * runtime. It costs a few KB in the page and works offline.
 */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [work, projects, papers, posts, videos] = await Promise.all([
    getCollection('work', ({ data }) => !data.draft),
    getCollection('projects'),
    getCollection('papers'),
    getCollection('posts', ({ data }) => !data.draft),
    getCollection('videos'),
  ]);

  return [
    ...PAGES,
    ...work.map((e) => ({
      href: `/work/${e.id}/`,
      title: e.data.title,
      detail: `${e.data.org} · ${e.data.period}`,
      group: 'work',
      keywords: [e.data.role, e.data.summary, ...e.data.stack].join(' '),
    })),
    ...projects.map((e) => ({
      href: `/projects/${e.id}/`,
      title: e.data.title,
      detail: e.data.summary,
      group: 'project',
      keywords: [e.data.repoName, e.data.category, ...e.data.tags, ...e.data.stack].join(' '),
    })),
    ...papers.map((e) => ({
      href: `/papers/${e.id}/`,
      title: e.data.title,
      detail: `${e.data.venue} · ${e.data.year}`,
      group: 'paper',
      keywords: [e.data.type, ...e.data.authors].join(' '),
    })),
    ...posts.map((e) => ({
      href: `/writing/${e.id}/`,
      title: e.data.title,
      detail: e.data.description,
      group: 'writing',
      keywords: e.data.tags.join(' '),
    })),
    ...videos.map((e) => ({
      href: `/videos/${e.id}/`,
      title: e.id,
      detail: 'Video',
      group: 'video',
      keywords: '',
    })),
  ];
}

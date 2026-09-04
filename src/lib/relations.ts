/**
 * What belongs with what.
 *
 * A project, the video about it and the write-up about it were three separate
 * pages with no way to get from one to the others. Six of the videos are about
 * a project in the archive and none of them said so.
 *
 * Nothing new had to be typed to fix that. Every video description already
 * carries the links Youniss put in it when he published — the repo, the demo,
 * the model — and every post already declares its `links`. So the relation is
 * DERIVED from that: each project contributes a set of identifying tokens (its
 * repo name, its GitHub Pages path, its own domain, its Hugging Face slugs) and
 * anything whose text contains one of those tokens is related to it.
 *
 * The alternative was a hand-maintained list of ids in frontmatter, which would
 * be wrong within a month. This cannot drift: publish a video with the repo link
 * in the description, as he already does, and the connection appears on the next
 * build.
 *
 * An explicit `links:` entry on the project always wins over a derived match, so
 * anything the heuristic gets wrong can be pinned by hand.
 */
import type { CollectionEntry } from 'astro:content';
import { VIDEOS, type VideoRecord } from './videos';

/** Below this length a token matches things it should not ("api", "cli"). */
const MIN_TOKEN = 5;

/**
 * Hosts that identify nobody, because every project links to them.
 *
 * `younissk.github.io` is the one that matters: it is the host of EVERY project
 * pages site, so taking it as a token made every project match every video whose
 * description linked to any project at all. The identifying part is the path
 * after it, which is captured separately. Same for the apex domain.
 */
const GENERIC_HOSTS =
  /^(github\.com|www\.github\.com|huggingface\.co|youtube\.com|www\.youtube\.com|youtu\.be|younissk\.github\.io|youniss\.dev|apps\.apple\.com)$/i;

export interface ProjectLike {
  id: string;
  data: {
    repoName?: string;
    links?: ReadonlyArray<{ kind: string; label: string; url: string }> | null;
  };
}

/**
 * The strings that mean "this project", lowercased.
 *
 * Drawn from the repo name and from the shape of its own links: a GitHub repo
 * slug, a project-pages path, a bespoke domain, a Hugging Face model or dataset
 * slug. Deliberately not the title — "Tython" is distinctive but "Shopify
 * Search" would match any video that says the words.
 */
export function identityTokens(project: ProjectLike): Set<string> {
  const tokens = new Set<string>();
  const add = (value?: string | null) => {
    const t = (value ?? '').trim().toLowerCase();
    if (t.length >= MIN_TOKEN && !GENERIC_HOSTS.test(t)) tokens.add(t);
  };

  add(project.data.repoName);

  for (const link of project.data.links ?? []) {
    const url = link.url ?? '';
    add(/github\.com\/younissk\/([^/\s"?#]+)/i.exec(url)?.[1]);
    add(/younissk\.github\.io\/([^/\s"?#]+)/i.exec(url)?.[1]);
    add(/huggingface\.co\/(?:datasets\/)?younissk\/([^/\s"?#]+)/i.exec(url)?.[1]);

    // A domain of its own, e.g. papernavigator.com.
    const host = /^https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/i.exec(url)?.[1];
    if (host && !GENERIC_HOSTS.test(host)) add(host.replace(/^www\./, ''));
  }

  return tokens;
}

const matches = (haystack: string, tokens: Set<string>): boolean => {
  const text = haystack.toLowerCase();
  for (const token of tokens) if (text.includes(token)) return true;
  return false;
};

/** Videos about this project, newest first. */
export function videosForProject(project: ProjectLike): VideoRecord[] {
  const tokens = identityTokens(project);

  /* An explicit video link on the project wins: pull its id straight out. */
  const pinned = new Set(
    (project.data.links ?? [])
      .filter((l) => l.kind === 'video')
      .map((l) => /(?:v=|youtu\.be\/|\/videos\/)([A-Za-z0-9_-]{6,})/.exec(l.url)?.[1])
      .filter((id): id is string => Boolean(id)),
  );

  return VIDEOS.filter(
    (video) =>
      pinned.has(video.id) ||
      (tokens.size > 0 && matches(`${video.title}\n${video.description}`, tokens)),
  ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** The reverse: projects this video is about. */
export function projectsForVideo(
  video: VideoRecord,
  projects: ReadonlyArray<ProjectLike>,
): ProjectLike[] {
  const text = `${video.title}\n${video.description}`;
  return projects.filter((project) => {
    const tokens = identityTokens(project);
    return tokens.size > 0 && matches(text, tokens);
  });
}

/**
 * Posts about this project.
 *
 * Matched on the post's declared `links` rather than its prose: a post that
 * merely mentions a repo in passing is not a write-up of it, but one that lists
 * the repo as an artifact is.
 */
export function postsForProject<T extends CollectionEntry<'posts'>>(
  project: ProjectLike,
  posts: ReadonlyArray<T>,
): T[] {
  const tokens = identityTokens(project);

  const pinnedSlugs = new Set(
    (project.data.links ?? [])
      .filter((l) => l.kind === 'post')
      .map((l) => /\/writing\/([^/\s"?#]+)/.exec(l.url)?.[1])
      .filter((slug): slug is string => Boolean(slug)),
  );

  return posts.filter((post) => {
    if (pinnedSlugs.has(post.id)) return true;
    if (tokens.size === 0) return false;
    const urls = (post.data.links ?? []).map((l) => l.url).join('\n');
    return matches(urls, tokens);
  });
}

/** The reverse, for a post page. */
export function projectsForPost<T extends CollectionEntry<'posts'>>(
  post: T,
  projects: ReadonlyArray<ProjectLike>,
): ProjectLike[] {
  const urls = (post.data.links ?? []).map((l) => l.url).join('\n');
  return projects.filter((project) => {
    const tokens = identityTokens(project);
    if (tokens.size > 0 && matches(urls, tokens)) return true;
    /* Or the project points at this post explicitly. */
    return (project.data.links ?? []).some(
      (l) => l.kind === 'post' && l.url.includes(`/writing/${post.id}/`),
    );
  });
}

/** Papers a project links to, resolved to their entry ids. */
export function paperIdsForProject(project: ProjectLike): string[] {
  return (project.data.links ?? [])
    .filter((l) => l.kind === 'paper')
    .map((l) => /\/papers\/([^/\s"?#]+)/.exec(l.url)?.[1])
    .filter((id): id is string => Boolean(id));
}

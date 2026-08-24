import videosData from '../data/videos.json';

export interface VideoRecord {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number } | null;
    medium: { url: string; width: number; height: number } | null;
    high: { url: string; width: number; height: number } | null;
  };
  duration: string | null;
  viewCount: number | null;
  url: string;
}

export const VIDEOS = videosData as unknown as VideoRecord[];

/**
 * A readable, stable slug for a video.
 *
 * `/videos/TMi4chYVcSY/` tells a search engine and a human nothing. The title
 * does both jobs at once, and a YouTube id is a poor URL for the same reason a
 * database primary key is.
 *
 * Deterministic: the same title always produces the same slug, so a rebuild
 * does not shuffle URLs. Two videos sharing a title get the id appended to the
 * later one rather than silently overwriting each other.
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
    .replace(/-+$/g, '');
}

const bySlug = new Map<string, string>(); // slug -> id
const byId = new Map<string, string>(); // id -> slug

for (const video of VIDEOS) {
  let slug = slugify(video.title) || video.id.toLowerCase();
  if (bySlug.has(slug)) slug = `${slug}-${video.id.toLowerCase()}`;
  bySlug.set(slug, video.id);
  byId.set(video.id, slug);
}

/** Slug for a video id. Falls back to the lowercased id if it is unknown. */
export function videoSlug(id: string): string {
  return byId.get(id) ?? id.toLowerCase();
}

/** Route for a video id. */
export function videoHref(id: string): string {
  return `/videos/${videoSlug(id)}/`;
}

/** Every (slug, id) pair, for getStaticPaths. */
export function videoRoutes(): { slug: string; id: string }[] {
  return [...bySlug].map(([slug, id]) => ({ slug, id }));
}

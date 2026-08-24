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
 * Route for a video: the YouTube id, deliberately.
 *
 * A slugified title reads better and is better for search, and it was built
 * that way for about an hour. It was reverted because the title is not stable:
 * renaming a video on YouTube would silently move its URL here on the next
 * sync and 404 every link anyone had shared. The id never changes, so the URL
 * never changes, which is worth more than the prettier path.
 */
export function videoHref(id: string): string {
  return `/videos/${id}/`;
}

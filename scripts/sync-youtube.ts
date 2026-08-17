/**
 * Build-time YouTube sync — writes `src/data/videos.json`.
 *
 * Run with:  npx tsx scripts/sync-youtube.ts
 *
 * ---------------------------------------------------------------------------
 * QUOTA DISCIPLINE — read this before changing a single request.
 *
 * The YouTube Data API v3 gives a default of 10,000 units/day. Cost is per
 * call, not per part:
 *
 *   channels.list        1 unit
 *   playlistItems.list   1 unit   (up to 50 items)
 *   videos.list          1 unit   (up to 50 ids)
 *   search.list        100 units  <-- ONE HUNDRED. Never use it here.
 *
 * Walking the uploads playlist is therefore ~100x cheaper than search.list for
 * the same result. A 100-video channel costs 5 units per full sync:
 *   1 (channels) + 2 (playlistItems x50) + 2 (videos x50).
 * The same sync via search.list would cost 200+ units and still miss fields.
 *
 * If you ever find yourself reaching for `search.list?channelId=...`: don't.
 * The uploads playlist id is a deterministic transform of the channel id and
 * gives you every public upload, newest first, for 1 unit per 50 videos.
 * ---------------------------------------------------------------------------
 *
 * Output is written with a fixed key order and a trailing newline so a run
 * that changes nothing produces a zero-line git diff.
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(HERE, '..', 'src', 'data', 'videos.json');
const THUMB_DIR = resolve(HERE, '..', 'public', 'thumbs');
const API = 'https://www.googleapis.com/youtube/v3';
const PAGE_SIZE = 50;

/** Every unit we spend, tallied so the log line can prove the discipline. */
let quotaUnits = 0;

// --- shapes ---------------------------------------------------------------

interface Thumb {
  url: string;
  width: number;
  height: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 timestamp. */
  publishedAt: string;
  thumbnails: {
    default: Thumb | null;
    medium: Thumb | null;
    high: Thumb | null;
  };
  /** ISO 8601 duration, e.g. "PT12M34S". Null when videos.list was skipped. */
  duration: string | null;
  /** Null when the channel hides view counts. */
  viewCount: number | null;
  url: string;
}

interface ApiThumbnail {
  url?: string;
  width?: number;
  height?: number;
}

interface PlaylistItem {
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: Record<string, ApiThumbnail | undefined>;
  };
  contentDetails?: {
    videoId?: string;
    videoPublishedAt?: string;
  };
}

interface VideoDetails {
  id?: string;
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string };
}

// --- transport ------------------------------------------------------------

class YouTubeApiError extends Error {}

/**
 * One API call. Counts a quota unit, retries transient 5xx/429 a couple of
 * times, and names quota exhaustion explicitly so a failing nightly run is
 * diagnosable from the log alone.
 */
async function api<T>(
  endpoint: string,
  params: Record<string, string>,
  cost: number,
): Promise<T> {
  const url = new URL(`${API}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const MAX_ATTEMPTS = 3;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    quotaUnits += cost;

    let res: Response;
    try {
      res = await fetch(url, { headers: { accept: 'application/json' } });
    } catch (cause) {
      if (attempt < MAX_ATTEMPTS) {
        await sleep(attempt * 1000);
        continue;
      }
      throw new YouTubeApiError(
        `network failure calling ${endpoint}: ${(cause as Error).message}`,
      );
    }

    if (res.ok) return (await res.json()) as T;

    const body = await res.text();
    const reason = extractReason(body);

    if (res.status === 403 && /quota/i.test(`${reason} ${body}`)) {
      throw new YouTubeApiError(
        `QUOTA EXCEEDED on ${endpoint} (reason: ${reason ?? 'quotaExceeded'}). ` +
          `Spent ~${quotaUnits} units this run. The daily allowance resets at ` +
          `midnight Pacific — do not "fix" this by adding retries.`,
      );
    }
    if (res.status === 403) {
      throw new YouTubeApiError(
        `${endpoint} returned 403 (reason: ${reason ?? 'forbidden'}). ` +
          `Check that YT_API_KEY is valid and that the YouTube Data API v3 is ` +
          `enabled for its project.`,
      );
    }
    if (res.status === 404) {
      throw new YouTubeApiError(
        `${endpoint} returned 404 — YT_CHANNEL_ID is probably wrong. It must be ` +
          `the UC… channel id, not a @handle or a custom URL.`,
      );
    }
    if ((res.status >= 500 || res.status === 429) && attempt < MAX_ATTEMPTS) {
      await sleep(attempt * 1000);
      continue;
    }

    throw new YouTubeApiError(
      `${endpoint} returned HTTP ${res.status}: ${body.slice(0, 400)}`,
    );
  }

  throw new YouTubeApiError(`${endpoint} failed after ${MAX_ATTEMPTS} attempts`);
}

function extractReason(body: string): string | null {
  try {
    const parsed = JSON.parse(body) as {
      error?: { errors?: { reason?: string }[]; message?: string };
    };
    return parsed.error?.errors?.[0]?.reason ?? parsed.error?.message ?? null;
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- normalisation --------------------------------------------------------

function toThumb(raw: ApiThumbnail | undefined): Thumb | null {
  if (!raw?.url || !raw.width || !raw.height) return null;
  return { url: raw.url, width: raw.width, height: raw.height };
}

/**
 * Pull every thumbnail down into public/thumbs/ and rewrite the URLs to point
 * there.
 *
 * This is a longevity requirement, not an optimisation. Hotlinked i.ytimg.com
 * URLs die when the video is taken down, the channel is closed, or Google
 * reorganises its CDN — and then the page is full of broken images with no way
 * to recover them. A committed JPEG survives all three.
 *
 * Files are keyed by video id and skipped if already present, so this costs one
 * request per NEW video and zero for the rest. Thumbnail fetches do not touch
 * the YouTube Data API, so they spend no quota.
 */
async function localiseThumbnails(videos: Video[]): Promise<void> {
  await mkdir(THUMB_DIR, { recursive: true });

  let fetched = 0;
  let failed = 0;

  for (const video of videos) {
    for (const size of ['default', 'medium', 'high'] as const) {
      const thumb = video.thumbnails[size];
      if (!thumb) continue;
      // Already local from a previous run — nothing to do.
      if (thumb.url.startsWith('/thumbs/')) continue;

      const name = `${video.id}-${size}.jpg`;
      const local = `/thumbs/${name}`;
      const path = resolve(THUMB_DIR, name);

      if (await readFile(path).then(() => true, () => false)) {
        thumb.url = local;
        continue;
      }

      try {
        const response = await fetch(thumb.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await writeFile(path, Buffer.from(await response.arrayBuffer()));
        thumb.url = local;
        fetched += 1;
      } catch (error) {
        // Leave the remote URL in place rather than pointing at a file that is
        // not there. A hotlink that works today beats a guaranteed 404.
        failed += 1;
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[sync-youtube] thumbnail ${video.id}/${size}: ${message}`);
      }
    }
  }

  console.log(
    `[sync-youtube] thumbnails: ${fetched} downloaded, ${failed} left remote.`,
  );
}

/** Fixed key order in, fixed key order out. Keeps the git diff honest. */
function serialise(videos: Video[]): string {
  const ordered = videos.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    publishedAt: v.publishedAt,
    thumbnails: {
      default: v.thumbnails.default,
      medium: v.thumbnails.medium,
      high: v.thumbnails.high,
    },
    duration: v.duration,
    viewCount: v.viewCount,
    url: v.url,
  }));
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

// --- steps ----------------------------------------------------------------

async function resolveUploadsPlaylist(key: string, channelId: string): Promise<string> {
  const data = await api<{
    items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[];
  }>('channels', { part: 'contentDetails', id: channelId, key }, 1);

  const uploads = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) {
    throw new YouTubeApiError(
      `channel ${channelId} has no uploads playlist — is YT_CHANNEL_ID a real ` +
        `UC… channel id?`,
    );
  }
  return uploads;
}

async function listUploads(key: string, playlistId: string): Promise<PlaylistItem[]> {
  const items: PlaylistItem[] = [];
  let pageToken: string | undefined;

  do {
    const params: Record<string, string> = {
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: String(PAGE_SIZE),
      key,
    };
    if (pageToken) params.pageToken = pageToken;

    const page = await api<{ items?: PlaylistItem[]; nextPageToken?: string }>(
      'playlistItems',
      params,
      1,
    );
    items.push(...(page.items ?? []));
    pageToken = page.nextPageToken;
  } while (pageToken);

  return items;
}

/** 1 unit per batch of 50 ids. Also doubles as the private/deleted filter: */
/** videos.list simply does not return ids the public cannot watch. */
async function fetchDetails(
  key: string,
  ids: string[],
): Promise<Map<string, VideoDetails>> {
  const byId = new Map<string, VideoDetails>();

  for (let i = 0; i < ids.length; i += PAGE_SIZE) {
    const batch = ids.slice(i, i + PAGE_SIZE);
    const page = await api<{ items?: VideoDetails[] }>(
      'videos',
      { part: 'contentDetails,statistics', id: batch.join(','), key },
      1,
    );
    for (const item of page.items ?? []) {
      if (item.id) byId.set(item.id, item);
    }
  }

  return byId;
}

// --- main -----------------------------------------------------------------

async function main(): Promise<void> {
  const key = process.env.YT_API_KEY?.trim();
  const channelId = process.env.YT_CHANNEL_ID?.trim();

  if (!key || !channelId) {
    const missing = [!key && 'YT_API_KEY', !channelId && 'YT_CHANNEL_ID']
      .filter(Boolean)
      .join(' and ');
    console.log(
      `[sync-youtube] ${missing} not set — skipping sync and leaving ` +
        `src/data/videos.json untouched. This is expected on a fresh clone; ` +
        `the site builds fine without it.`,
    );
    return;
  }

  const uploads = await resolveUploadsPlaylist(key, channelId);
  const rawItems = await listUploads(key, uploads);

  const ids = [
    ...new Set(
      rawItems
        .map((item) => item.contentDetails?.videoId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const details = await fetchDetails(key, ids);

  const videos: Video[] = [];
  const seen = new Set<string>();

  for (const item of rawItems) {
    const id = item.contentDetails?.videoId;
    if (!id || seen.has(id)) continue;

    // Not returned by videos.list => private, deleted, or region-blocked.
    const detail = details.get(id);
    if (!detail) continue;
    seen.add(id);

    const thumbs = item.snippet?.thumbnails ?? {};
    const rawViews = detail.statistics?.viewCount;
    const views = rawViews === undefined ? null : Number.parseInt(rawViews, 10);

    videos.push({
      id,
      title: item.snippet?.title ?? '',
      description: item.snippet?.description ?? '',
      publishedAt:
        item.contentDetails?.videoPublishedAt ?? item.snippet?.publishedAt ?? '',
      thumbnails: {
        default: toThumb(thumbs.default),
        medium: toThumb(thumbs.medium),
        high: toThumb(thumbs.high),
      },
      duration: detail.contentDetails?.duration ?? null,
      viewCount: views !== null && Number.isFinite(views) ? views : null,
      url: `https://www.youtube.com/watch?v=${id}`,
    });
  }

  // Newest first; id as the tie-breaker so the ordering is deterministic.
  videos.sort((a, b) => {
    const delta = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    if (delta !== 0 && Number.isFinite(delta)) return delta;
    return a.id.localeCompare(b.id);
  });

  await localiseThumbnails(videos);

  const next = serialise(videos);
  const previous = await readFile(OUT_PATH, 'utf8').catch(() => null);

  if (previous === next) {
    console.log(
      `[sync-youtube] ${videos.length} videos, no change. ` +
        `Quota spent: ${quotaUnits} units.`,
    );
    return;
  }

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, next, 'utf8');
  console.log(
    `[sync-youtube] wrote ${videos.length} videos to src/data/videos.json. ` +
      `Quota spent: ${quotaUnits} units.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[sync-youtube] FAILED: ${message}`);
  process.exitCode = 1;
});

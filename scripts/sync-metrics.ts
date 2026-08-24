/**
 * Build-time platform-metrics sync — writes `src/data/metrics.json`.
 *
 * Run with:  npx tsx scripts/sync-metrics.ts   (or `npm run sync:metrics`)
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * This site has no analytics: no tracker, no third-party script, nothing that
 * watches a visitor. That is deliberate and it is not up for renegotiation.
 *
 * But the work itself already carries public counters on the platforms that
 * host it — Hugging Face download counts, GitHub stars. Those are measurements
 * of the *work*, not of the *reader*, and they are already public whether this
 * site shows them or not. Surfacing them is the honest version of analytics.
 *
 * The numbers are fetched here, at build time, and committed as a plain JSON
 * file. Nothing is fetched in the browser. A reader of the published site makes
 * no request to Hugging Face or GitHub, and neither company learns that anyone
 * visited. That property is the whole point — do not "improve" this by moving
 * the fetch client-side.
 * ---------------------------------------------------------------------------
 *
 * SHAPE OF THE OUTPUT
 *
 * Keyed by the exact URL string that appears in a project's frontmatter, so
 * rendering is a plain object lookup with no matching, normalising or slug
 * logic anywhere in the components:
 *
 *   {
 *     "https://huggingface.co/younissk/nanoBeard-sloop-14M": { "downloads": 132, "likes": 6 },
 *     "https://github.com/younissk/tython": { "stars": 4, "forks": 0 },
 *     "syncedAt": "2026-08-18"
 *   }
 *
 * Keys are sorted and the file ends with a newline, so a run that changes
 * nothing produces a zero-line git diff.
 *
 * `syncedAt` is the one key that is not a URL — no URL can collide with it, so
 * `metrics[link.url]` stays a plain lookup. It is deliberately NOT touched when
 * the numbers are unchanged: bumping a timestamp on every run would make the
 * weekly Action commit something every single week and turn the history into
 * noise. It therefore means "the day these numbers were last observed to be
 * different", which is exactly what "as of <date>" claims on the page — never
 * a promise that the figures are live.
 *
 * FAILURE POLICY
 *
 * A missing number must never be worse than no number. Therefore:
 *   - a single failed lookup is logged and skipped, never thrown;
 *   - a skipped entry keeps whatever value the committed file already had, so
 *     a rate limit degrades to "stale" rather than "wiped";
 *   - if nothing at all could be fetched, the existing file is left untouched
 *     and the process exits 0.
 * The site must build and render correctly against an empty `{}`.
 */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECTS_DIR = resolve(HERE, '..', 'src', 'content', 'projects');
const OUT_PATH = resolve(HERE, '..', 'src', 'data', 'metrics.json');

const HF_API = 'https://huggingface.co/api';
const GH_API = 'https://api.github.com';

/** Hosts we know how to ask. Anything else in `links` is ignored on purpose. */
const HF_HOST = 'huggingface.co';
const GH_HOST = 'github.com';

// --- shapes ---------------------------------------------------------------

interface HubMetric {
  downloads: number;
  downloadsMonth?: number;
  likes: number;
}

interface RepoMetric {
  stars: number;
  forks: number;
}

type Metric = HubMetric | RepoMetric;
type Metrics = Record<string, Metric>;

/** One link found in project frontmatter, reduced to what this script needs. */
interface Target {
  /** The exact frontmatter URL — this becomes the JSON key. */
  url: string;
  kind: 'model' | 'dataset' | 'repo';
  /** `younissk/nanoBeard-sloop-14M` for the Hub, `tython` for GitHub. */
  slug: string;
}

// --- reading the frontmatter ----------------------------------------------

/**
 * Pull every `links:` entry out of the project collection.
 *
 * The repo and model names are read from the content files rather than
 * hardcoded here, so publishing a new model is a one-line frontmatter edit and
 * this script picks it up on the next run with no second place to remember.
 *
 * The frontmatter link rows are single-line flow mappings by convention:
 *   - { kind: model, label: "sloop-14M", url: "https://huggingface.co/..." }
 * so a line-wise regex is enough and this stays dependency-free. A row that
 * does not match is skipped rather than guessed at.
 */
async function collectTargets(): Promise<Target[]> {
  const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith('.md'));
  const byUrl = new Map<string, Target>();

  for (const file of files) {
    const source = await readFile(resolve(PROJECTS_DIR, file), 'utf8');

    // Frontmatter only: everything between the first pair of `---` fences.
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
    if (!match) continue;

    for (const line of match[1].split('\n')) {
      const kind = /\bkind:\s*([a-z]+)/.exec(line)?.[1];
      const url = /\burl:\s*"([^"]+)"/.exec(line)?.[1];
      if (!kind || !url) continue;
      if (kind !== 'model' && kind !== 'dataset' && kind !== 'repo') continue;

      const slug = slugFor(kind, url);
      if (!slug) continue;

      // Same URL listed on two projects is one lookup, not two.
      byUrl.set(url, { url, kind, slug });
    }
  }

  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

/**
 * The platform identifier inside a URL, or null when the URL is not on a host
 * we can query (a personal site, a Netlify demo, an internal /papers/ page).
 */
function slugFor(kind: Target['kind'], url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null; // Relative link — an on-site page, nothing to look up.
  }

  const host = parsed.hostname.replace(/^www\./, '');
  const parts = parsed.pathname.split('/').filter(Boolean);

  if (kind === 'repo') {
    if (host !== GH_HOST || parts.length < 2) return null;
    return `${parts[0]}/${parts[1]}`;
  }

  if (host !== HF_HOST) return null;

  if (kind === 'dataset') {
    // https://huggingface.co/datasets/<owner>/<name>
    if (parts[0] !== 'datasets' || parts.length < 3) return null;
    return `${parts[1]}/${parts[2]}`;
  }

  // model: https://huggingface.co/<owner>/<name>
  if (parts.length < 2 || parts[0] === 'datasets') return null;
  return `${parts[0]}/${parts[1]}`;
}

/** Everything before the first slash — the Hub owner / GitHub account. */
const ownerOf = (slug: string) => slug.split('/')[0];

// --- transport ------------------------------------------------------------

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_ATTEMPTS = 3;

/**
 * One JSON GET. Returns null on any failure — the caller decides what a null
 * means for that particular lookup, and no failure here can abort the run.
 *
 * Transient 5xx and 429 are retried with a short backoff. Both APIs hand out
 * the occasional 502/504 under load, and letting one of those quietly freeze a
 * count at last week's value for a week is a worse outcome than waiting a
 * second. A 404 or a hard 403 is not retried: those are answers, not hiccups.
 */
async function getJson<T>(
  url: string,
  headers: Record<string, string>,
  label: string,
): Promise<T | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const last = attempt === MAX_ATTEMPTS;

    try {
      const res = await fetch(url, { headers: { accept: 'application/json', ...headers } });

      if (res.ok) return (await res.json()) as T;

      const transient = res.status >= 500 || res.status === 429;
      if (transient && !last) {
        await sleep(attempt * 750);
        continue;
      }

      const hint =
        res.status === 403 || res.status === 429
          ? ' (rate limited — set GITHUB_TOKEN to raise the ceiling)'
          : res.status === 404
            ? ' (not found — renamed, deleted, or made private?)'
            : '';
      console.warn(`[sync-metrics] ${label}: HTTP ${res.status}${hint}`);
      return null;
    } catch (error) {
      if (!last) {
        await sleep(attempt * 750);
        continue;
      }
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[sync-metrics] ${label}: ${message}`);
      return null;
    }
  }

  return null;
}

// --- Hugging Face ---------------------------------------------------------

interface HubItem {
  id?: string;
  /** Rolling 30-day window — what a repo page shows by default. */
  downloads?: number;
  /** Cumulative. Only returned when explicitly expanded, see below. */
  downloadsAllTime?: number;
  likes?: number;
}

/**
 * One request per (owner, kind) pair returns every public repo that owner has,
 * with `downloads` and `likes` already on each item. Listing beats asking for
 * each model individually: eight models cost one request instead of eight, and
 * a listing that succeeds gives a consistent snapshot.
 */
async function fetchHubIndex(
  endpoint: 'models' | 'datasets',
  owner: string,
): Promise<Map<string, HubMetric> | null> {
  /*
   * `downloads` from this endpoint is a ROLLING 30-DAY count, not a total. It
   * is what the site showed at first, and it made the work look far smaller
   * than it is: sloop-14M reads 111 for the month against 3,407 all time.
   * Worse, it goes down week to week, so a chart of it looks like decline.
   *
   * downloadsAllTime is the cumulative figure and is only returned when asked
   * for by name through expand[].
   */
  const url =
    `${HF_API}/${endpoint}?author=${encodeURIComponent(owner)}&limit=1000` +
    `&expand[]=downloads&expand[]=downloadsAllTime&expand[]=likes`;
  const items = await getJson<HubItem[]>(url, {}, `hf ${endpoint} for ${owner}`);
  if (!Array.isArray(items)) return null;

  const index = new Map<string, HubMetric>();
  for (const item of items) {
    if (!item.id) continue;
    const allTime = Number.isFinite(item.downloadsAllTime)
      ? Number(item.downloadsAllTime)
      : null;
    const month = Number.isFinite(item.downloads) ? Number(item.downloads) : 0;
    index.set(item.id.toLowerCase(), {
      /* All time is the headline. Fall back to the 30-day figure only if the
         expansion ever stops being honoured, so the number never vanishes. */
      downloads: allTime ?? month,
      downloadsMonth: month,
      likes: Number.isFinite(item.likes) ? Number(item.likes) : 0,
    });
  }
  return index;
}

// --- GitHub ---------------------------------------------------------------

interface RepoItem {
  stargazers_count?: number;
  forks_count?: number;
}

/**
 * GitHub has no "all repos with counts" endpoint that covers forks and renames
 * reliably, so this is one request per repo. Unauthenticated that is 60/hour,
 * which comfortably covers the ~15 repos linked here when run by hand; the
 * Action passes its own token and gets 5,000/hour.
 */
async function fetchRepo(slug: string, token: string | undefined): Promise<RepoMetric | null> {
  const headers: Record<string, string> = {
    'user-agent': 'youniss.dev-sync-metrics',
    'x-github-api-version': '2022-11-28',
  };
  if (token) headers.authorization = `Bearer ${token}`;

  const data = await getJson<RepoItem>(`${GH_API}/repos/${slug}`, headers, `gh ${slug}`);
  if (!data) return null;

  return {
    stars: Number.isFinite(data.stargazers_count) ? Number(data.stargazers_count) : 0,
    forks: Number.isFinite(data.forks_count) ? Number(data.forks_count) : 0,
  };
}

// --- output ---------------------------------------------------------------

/** The reserved non-URL key carrying the observation date. */
const SYNCED_AT = 'syncedAt';

/** Sorted keys, fixed key order per entry, trailing newline. */
function serialise(metrics: Metrics, syncedAt: string | null): string {
  const ordered: Record<string, Metric | string> = {};
  for (const key of Object.keys(metrics).sort()) {
    const value = metrics[key];
    ordered[key] =
      'downloads' in value
        ? {
            downloads: value.downloads,
            downloadsMonth: value.downloadsMonth,
            likes: value.likes,
          }
        : { stars: value.stars, forks: value.forks };
  }
  if (syncedAt) ordered[SYNCED_AT] = syncedAt;
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

async function readExisting(): Promise<{ entries: Metrics; syncedAt: string | null }> {
  const empty = { entries: {} as Metrics, syncedAt: null };

  const raw = await readFile(OUT_PATH, 'utf8').catch(() => null);
  if (raw === null) return empty;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn('[sync-metrics] existing metrics.json is not valid JSON — starting fresh.');
    return empty;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return empty;

  const { [SYNCED_AT]: stamp, ...rest } = parsed as Record<string, unknown>;
  return {
    entries: rest as Metrics,
    syncedAt: typeof stamp === 'string' ? stamp : null,
  };
}

// --- main -----------------------------------------------------------------

async function main(): Promise<void> {
  const targets = await collectTargets();
  if (targets.length === 0) {
    console.log('[sync-metrics] no model, dataset or repo links in the project collection.');
    return;
  }

  const token = process.env.GITHUB_TOKEN?.trim() || undefined;
  const { entries: previous, syncedAt: previousStamp } = await readExisting();

  /* --- Hugging Face: one listing per owner per kind --------------------- */

  const modelOwners = new Set(
    targets.filter((t) => t.kind === 'model').map((t) => ownerOf(t.slug)),
  );
  const datasetOwners = new Set(
    targets.filter((t) => t.kind === 'dataset').map((t) => ownerOf(t.slug)),
  );

  const hubIndex = new Map<string, HubMetric>();
  /** Owners whose listing came back — absence from a *successful* listing is
      meaningful (gone or private); absence after a failure is not. */
  const listed = new Set<string>();

  for (const owner of modelOwners) {
    const index = await fetchHubIndex('models', owner);
    if (!index) continue;
    listed.add(`models:${owner}`);
    for (const [id, metric] of index) hubIndex.set(id, metric);
  }
  for (const owner of datasetOwners) {
    const index = await fetchHubIndex('datasets', owner);
    if (!index) continue;
    listed.add(`datasets:${owner}`);
    for (const [id, metric] of index) hubIndex.set(id, metric);
  }

  /* --- resolve every target -------------------------------------------- */

  const next: Metrics = {};
  let fetched = 0;
  let carried = 0;
  let dropped = 0;

  for (const target of targets) {
    let metric: Metric | null = null;

    if (target.kind === 'repo') {
      metric = await fetchRepo(target.slug, token);
    } else {
      const endpoint = target.kind === 'model' ? 'models' : 'datasets';
      const owner = ownerOf(target.slug);
      if (listed.has(`${endpoint}:${owner}`)) {
        // Listing succeeded. A slug missing from it no longer exists publicly.
        metric = hubIndex.get(target.slug.toLowerCase()) ?? null;
        if (!metric) {
          console.warn(
            `[sync-metrics] ${target.slug} is not in the public ${endpoint} listing for ${owner}.`,
          );
        }
      }
      // Listing failed: metric stays null and the previous value is carried.
    }

    if (metric) {
      next[target.url] = metric;
      fetched += 1;
      continue;
    }

    // Failed lookup: keep whatever is already committed rather than losing it.
    const stale = previous[target.url];
    if (stale) {
      next[target.url] = stale;
      carried += 1;
    } else {
      dropped += 1;
    }
  }

  /* --- write ------------------------------------------------------------ */

  if (fetched === 0) {
    console.log(
      `[sync-metrics] nothing could be fetched (${targets.length} targets attempted) — ` +
        `leaving src/data/metrics.json untouched.`,
    );
    return;
  }

  const summary =
    `${fetched} fetched` +
    (carried ? `, ${carried} carried over from the last run` : '') +
    (dropped ? `, ${dropped} with no number at all` : '');

  // Compare the numbers alone, ignoring the stamp, so an unchanged week writes
  // nothing at all rather than committing a fresh date over identical figures.
  // A file that has no stamp yet still gets one — otherwise the very first run
  // on an already-correct file would leave the page with nothing to date.
  if (previousStamp !== null && serialise(next, null) === serialise(previous, null)) {
    console.log(`[sync-metrics] ${summary}. No change since ${previousStamp ?? 'the last run'}.`);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, serialise(next, today), 'utf8');
  console.log(`[sync-metrics] wrote src/data/metrics.json (${today}) — ${summary}.`);
}

main().catch((error: unknown) => {
  // Only a bug in this script reaches here; every network path returns null.
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[sync-metrics] FAILED: ${message}`);
  process.exitCode = 1;
});

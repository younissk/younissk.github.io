/**
 * The one React island on the site: search, filter and sort over the project
 * archive.
 *
 * Astro renders this component to static HTML at build time, so the complete
 * list is present and crawlable with JavaScript disabled; `client:load` then
 * hydrates the controls over it. Filter state is initialised from the URL query
 * string in an effect (never during render) so the first client render matches
 * the server output exactly.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';

/* --- platform metrics ---------------------------------------------------- *
 *
 * `src/data/metrics.json` is a build-time snapshot of the public counters on
 * the platforms that host the work — Hugging Face downloads, GitHub stars. It
 * is fetched by scripts/sync-metrics.ts and committed. Nothing is requested
 * from a reader's browser, which is the whole reason this site can show usage
 * numbers while having no analytics at all.
 *
 * The file is keyed by the exact URL string in a project's frontmatter, so
 * lookup is a plain index — no slug parsing, no matching, no fallbacks.
 * `syncedAt` is the single non-URL key; no URL can collide with it.
 * --------------------------------------------------------------------------- */

export type MetricEntry =
  | { downloads: number; likes: number }
  | { stars: number; forks: number };

/** The shape of metrics.json. Empty (`{}`) is a supported, silent state. */
export type Metrics = Record<string, MetricEntry | string | undefined>;

export interface LinkCount {
  value: number;
  unit: 'downloads' | 'stars';
}

/**
 * The one number worth putting next to a link, or null.
 *
 * Null when there is no entry, and — deliberately — null when the number is
 * zero. A published model with no downloads yet is not information; "0
 * downloads" reads as failure where silence reads as "not measured". Likes and
 * forks are carried in the JSON but not surfaced: one number per link is the
 * point, and a second one turns a button into a dashboard.
 */
export function linkCount(url: string, metrics: Metrics): LinkCount | null {
  const entry = metrics[url];
  if (!entry || typeof entry !== 'object') return null;

  if ('downloads' in entry) {
    return entry.downloads > 0 ? { value: entry.downloads, unit: 'downloads' } : null;
  }
  if ('stars' in entry) {
    return entry.stars > 0 ? { value: entry.stars, unit: 'stars' } : null;
  }
  return null;
}

/** Fixed locale so the server render and the hydrated render agree exactly. */
export const formatCount = (value: number) => value.toLocaleString('en-US');

/** The date the numbers were last observed to move, or null if never synced. */
export function syncedAt(metrics: Metrics): string | null {
  const stamp = metrics.syncedAt;
  return typeof stamp === 'string' && stamp ? stamp : null;
}

export interface ProjectRow {
  id: string;
  title: string;
  repoName: string;
  summary: string;
  year: number;
  period: string;
  category: string;
  status: string;
  tags: string[];
  stack: string[];
  links: { kind: string; label: string; url: string }[];
  hasBody: boolean;
  private: boolean;
  featured: boolean;
  /* Precomputed on the server: an SVG path for this project's generated mark.
     The walk is deterministic from the slug, so it never changes, and doing it
     at build time keeps it out of the island's bundle. See src/lib/mark.ts. */
  mark: { path: string; cols: number; rows: number };
}

type Sort = 'newest' | 'oldest' | 'alpha';

interface Props {
  projects: ProjectRow[];
  categories: readonly string[];
  /** Build-time platform counters, keyed by link URL. `{}` is fine and silent. */
  metrics?: Metrics;
}

/** How many tags the filter bar shows before "all N tags" is used. */
const TAG_PREVIEW = 16;


function sortRows(rows: ProjectRow[], sort: Sort): ProjectRow[] {
  const out = [...rows];
  if (sort === 'alpha') {
    out.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    const dir = sort === 'oldest' ? 1 : -1;
    out.sort((a, b) => (a.year - b.year) * dir || a.title.localeCompare(b.title));
  }
  return out;
}

export default function ProjectIndex({ projects, categories, metrics = {} }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('newest');
  const [hydrated, setHydrated] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  /* --- URL <-> state ----------------------------------------------------- */

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const q = p.get('q');
    const cat = p.get('category');
    const tag = p.get('tags');
    const s = p.get('sort');
    if (q) setQuery(q);
    if (cat && categories.includes(cat)) setCategory(cat);
    if (tag) setTags(tag.split(',').map((t) => t.trim()).filter(Boolean));
    if (s === 'oldest' || s === 'alpha' || s === 'newest') setSort(s);
    if (p.get('featured') === '1') setFeaturedOnly(true);
    setHydrated(true);
  }, [categories]);

  useEffect(() => {
    if (!hydrated) return;
    const p = new URLSearchParams();
    if (query.trim()) p.set('q', query.trim());
    if (category) p.set('category', category);
    if (tags.length) p.set('tags', tags.join(','));
    if (featuredOnly) p.set('featured', '1');
    if (sort !== 'newest') p.set('sort', sort);
    const qs = p.toString();
    window.history.replaceState(
      null,
      '',
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  }, [hydrated, query, category, tags, featuredOnly, sort]);

  /* --- keyboard ---------------------------------------------------------- */

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      if (event.key === 'Escape') {
        if (query) {
          setQuery('');
          searchRef.current?.focus();
        } else {
          setCategory(null);
          setTags([]);
          setFeaturedOnly(false);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [query]);

  /* --- filtering --------------------------------------------------------- */

  const fuse = useMemo(
    () =>
      new Fuse(projects, {
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
        keys: [
          { name: 'title', weight: 3 },
          { name: 'repoName', weight: 2 },
          { name: 'summary', weight: 2 },
          { name: 'tags', weight: 1.5 },
          { name: 'stack', weight: 1.5 },
        ],
      }),
    [projects],
  );

  const trimmed = query.trim();

  /**
   * Everything that survives the search box alone. Multi-word queries are run
   * term by term and intersected, so "audio retrieval" finds entries where the
   * two words live in different fields rather than demanding one fuzzy blob.
   */
  const searched = useMemo(() => {
    const terms = trimmed.split(/\s+/).filter((term) => term.length >= 2);
    if (terms.length === 0) return projects;

    let scores: Map<string, number> | null = null;
    for (const term of terms) {
      const hits = new Map<string, number>();
      for (const hit of fuse.search(term)) hits.set(hit.item.id, hit.score ?? 0);
      if (scores === null) {
        scores = hits;
      } else {
        const merged = new Map<string, number>();
        for (const [id, score] of hits) {
          const previous = scores.get(id);
          if (previous !== undefined) merged.set(id, previous + score);
        }
        scores = merged;
      }
      if (scores.size === 0) break;
    }

    const byId = new Map(projects.map((p) => [p.id, p]));
    return [...(scores ?? new Map<string, number>()).entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => byId.get(id)!)
      .filter(Boolean);
  }, [fuse, projects, trimmed]);

  const matchesRest = useCallback(
    (p: ProjectRow, opts: { category?: string | null; tags?: string[]; featured?: boolean }) => {
      const cat = opts.category === undefined ? category : opts.category;
      const tagList = opts.tags === undefined ? tags : opts.tags;
      const feat = opts.featured === undefined ? featuredOnly : opts.featured;
      if (cat && p.category !== cat) return false;
      if (feat && !p.featured) return false;
      return tagList.every((t) => p.tags.includes(t));
    },
    [category, tags, featuredOnly],
  );

  const visible = useMemo(
    () => sortRows(searched.filter((p) => matchesRest(p, {})), sort),
    [searched, matchesRest, sort],
  );

  /** Category counts respect the search box and the tag selection, not itself. */
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of searched) {
      if (!matchesRest(p, { category: null })) continue;
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return counts;
  }, [searched, matchesRest]);

  /** Only tags that still exist in the current result set, most common first. */
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of searched) {
      if (!matchesRest(p, {})) continue;
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    for (const t of tags) if (!counts.has(t)) counts.set(t, 0);
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [searched, matchesRest, tags]);


  const toggleTag = (tag: string) =>
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );

  const clearAll = () => {
    setQuery('');
    setCategory(null);
    setTags([]);
    setFeaturedOnly(false);
  };

  const anyFilter = trimmed !== '' || category !== null || tags.length > 0 || featuredOnly;

  /** Which single filter is responsible for an empty result set, if it is one. */
  const blame = useMemo(() => {
    if (visible.length > 0) return null;
    if (trimmed && projects.filter((p) => matchesRest(p, {})).length > 0) {
      return `The search for “${trimmed}”`;
    }
    if (category && searched.filter((p) => matchesRest(p, { category: null })).length > 0) {
      return `The “${category}” category`;
    }
    if (tags.length && searched.filter((p) => matchesRest(p, { tags: [] })).length > 0) {
      return tags.length === 1
        ? `The “${tags[0]}” tag`
        : `The tag combination ${tags.map((t) => `“${t}”`).join(' + ')}`;
    }
    if (featuredOnly && searched.filter((p) => matchesRest(p, { featured: false })).length > 0) {
      return 'The “selected only” filter';
    }
    return null;
  }, [visible.length, trimmed, category, tags, featuredOnly, projects, searched, matchesRest]);

  /** How many projects each active filter would return on its own. */
  const soloCounts = useMemo(() => {
    if (visible.length > 0) return [];
    const out: { label: string; count: number }[] = [];
    if (trimmed) out.push({ label: `“${trimmed}”`, count: searched.length });
    if (category) {
      out.push({
        label: category,
        count: projects.filter((p) => p.category === category).length,
      });
    }
    for (const tag of tags) {
      out.push({ label: tag, count: projects.filter((p) => p.tags.includes(tag)).length });
    }
    if (featuredOnly) {
      out.push({ label: 'selected', count: projects.filter((p) => p.featured).length });
    }
    return out;
  }, [visible.length, trimmed, category, tags, featuredOnly, projects, searched]);

  return (
    <div>
      {/* Trimmed to a search box and eight category chips.
          This used to be 576px of filter machinery on desktop and a full phone
          screen on mobile — a faceted search with a 49-tag cloud, a sort
          control and a "selected only" toggle, all guarding thirteen items.
          Tag and sort state is kept because the URL still carries it, but it no
          longer costs a screen of chrome to reach the first project. */}
      <section aria-label="Filter projects" className="pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <label className="sr-only" htmlFor="project-search">
              Search projects
            </label>
            <input
              id="project-search"
              ref={searchRef}
              type="search"
              className="field pr-16"
              placeholder={`Search ${projects.length} projects…`}
              value={query}
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-faint sm:block"
            >
              /
            </kbd>
          </div>

          <ul className="tag-row shrink-0">
            <li>
              <button
                type="button"
                className="tag"
                data-active={category === null ? 'true' : undefined}
                aria-pressed={category === null}
                onClick={() => setCategory(null)}
              >
                all
              </button>
            </li>
            {categories.map((c) => {
              const count = categoryCounts.get(c) ?? 0;
              if (count === 0 && category !== c) return null;
              return (
                <li key={c}>
                  <button
                    type="button"
                    className="tag"
                    data-active={category === c ? 'true' : undefined}
                    aria-pressed={category === c}
                    onClick={() => setCategory(category === c ? null : c)}
                  >
                    {c}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Only appears once something is actually filtering. */}
        {anyFilter && (
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <p className="meta" aria-live="polite">
              {visible.length} of {projects.length}
            </p>
            {tags.map((tag) => (
              <button key={tag} type="button" className="tag" data-active="true" onClick={() => toggleTag(tag)}>
                {tag} ✕
              </button>
            ))}
            {featuredOnly && (
              <button type="button" className="tag" data-active="true" onClick={() => setFeaturedOnly(false)}>
                selected ✕
              </button>
            )}
            <button type="button" className="meta link-quiet" onClick={clearAll}>
              Clear (Esc)
            </button>
          </div>
        )}
      </section>

      {visible.length === 0 ? (
        <div className="panel">
          <p className="font-medium text-ink">No projects match.</p>
          <p className="row-desc mt-2">
            {blame
              ? `${blame} is what rules everything out — drop it and the remaining filters still return results.`
              : 'No single filter is responsible: each one matches something on its own, but nothing in the archive satisfies all of them at once.'}
          </p>
          {soloCounts.length > 0 && (
            <ul className="meta-row mt-3">
              {soloCounts.map((item) => (
                <li key={item.label}>
                  {item.label} <span className="tabular">{item.count}</span> alone
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="btn mt-4" onClick={clearAll}>
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className="card-list">
          {visible.map((p) => (
            <li key={p.id} className="pcard">
              {/* A banner, so a wall of thirteen cards is not thirteen
                  identical blocks of text. Nothing here has a screenshot, so
                  each project draws its own frozen self-avoiding walk — the
                  same simulation that runs behind the landing page. */}
              <a className="pcard-mark" href={`/projects/${p.id}/`} tabIndex={-1} aria-hidden="true">
                <svg
                  viewBox={`-0.5 -0.5 ${p.mark.cols} ${p.mark.rows}`}
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <path d={p.mark.path} />
                </svg>
              </a>

              <div className="pcard-head">
                <a className="pcard-title" href={`/projects/${p.id}/`}>
                  {p.title}
                </a>
                <ul className="meta-row shrink-0">
                  <li className="tabular">{p.year}</li>
                  <li>{p.category}</li>
                  <li className="status" data-status={p.status}>{p.status}</li>
                </ul>
              </div>

              <p className="pcard-summary">{p.summary}</p>

              {p.tags.length > 0 && (
                <ul className="tag-row mt-3">
                  {p.tags.map((tag) => (
                    <li key={tag}>
                      <button
                        type="button"
                        className="tag"
                        data-active={tags.includes(tag) ? 'true' : undefined}
                        aria-pressed={tags.includes(tag)}
                        title={`Filter by ${tag}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pcard-actions">
                {(() => {
                  /* Two, not five. Five bordered buttons per card meant a
                     thirteen-card page carried sixty-odd identical boxes and
                     spent the yellow accent thirteen times, which is how an
                     accent stops meaning anything. Everything else is one
                     click away on the detail page. */
                  const CARD_MAX = 2;
                  const primary = p.links.find(
                    (l) => l.kind === 'site' || l.kind === 'demo',
                  );
                  const rest = p.links.filter((l) => l !== primary);
                  const shown = rest.slice(0, CARD_MAX - (primary ? 1 : 0) - (p.hasBody ? 1 : 0));
                  const hidden = rest.length - shown.length;

                  return (
                    <>
                      {primary && (
                        <a
                          className="btn btn-sm btn-primary"
                          href={primary.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {primary.label} ↗
                        </a>
                      )}
                      {p.hasBody && (
                        <a className="btn btn-sm" href={`/projects/${p.id}/`}>
                          Write-up
                        </a>
                      )}
                      {shown.map((l) => {
                        const external = l.url.startsWith('http');
                        /* The button has no room to spell out the unit, so the
                           bare number rides the label and the title attribute
                           carries the word. Absent entirely when there is no
                           number — see linkCount. */
                        const count = linkCount(l.url, metrics);
                        return (
                          <a
                            key={l.url}
                            className="btn btn-sm"
                            href={l.url}
                            title={
                              count
                                ? `${l.kind}: ${l.label} — ${formatCount(count.value)} ${count.unit}`
                                : `${l.kind}: ${l.label}`
                            }
                            target={external ? '_blank' : undefined}
                            rel={external ? 'noopener noreferrer' : undefined}
                          >
                            {l.label}
                            {count && (
                              <span className="tabular font-mono text-meta text-ink-faint">
                                · {formatCount(count.value)}
                              </span>
                            )}
                            {external ? ' ↗' : ''}
                          </a>
                        );
                      })}
                      {hidden > 0 && (
                        <a className="btn btn-sm" href={`/projects/${p.id}/`}>
                          +{hidden} more
                        </a>
                      )}
                      {p.links.length === 0 && p.private && (
                        <span className="pcard-note">private repo</span>
                      )}
                      {p.featured && <span className="pcard-note ml-auto">selected</span>}
                    </>
                  );
                })()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

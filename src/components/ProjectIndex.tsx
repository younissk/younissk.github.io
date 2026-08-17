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
  repo: string | null;
  demo: string | null;
  paper: string | null;
  open: string | null;
  private: boolean;
  featured: boolean;
}

type Sort = 'newest' | 'oldest' | 'alpha';

interface Props {
  projects: ProjectRow[];
  categories: readonly string[];
}

/** How many tags the filter bar shows before "all N tags" is used. */
const TAG_PREVIEW = 16;

const SORTS: ReadonlyArray<{ value: Sort; label: string }> = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'alpha', label: 'A–Z' },
];

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

export default function ProjectIndex({ projects, categories }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('newest');
  const [showAllTags, setShowAllTags] = useState(false);
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

  const previewTags = tagCounts.filter(
    ([tag], index) => index < TAG_PREVIEW || tags.includes(tag),
  );
  const shownTags = showAllTags ? tagCounts : previewTags;

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
      <section aria-label="Filter projects" className="pb-8">
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
              className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded-hair border border-border px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-faint sm:block"
            >
              /
            </kbd>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              type="button"
              className="tag"
              data-active={featuredOnly ? 'true' : undefined}
              aria-pressed={featuredOnly}
              title="Only the projects picked out as representative"
              onClick={() => setFeaturedOnly((v) => !v)}
            >
              selected only
            </button>
            <label className="label shrink-0" htmlFor="project-sort">
              Sort
            </label>
            <select
              id="project-sort"
              className="field w-auto"
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="label mb-2">Category</h2>
          <ul className="tag-row">
            <li>
              <button
                type="button"
                className="tag"
                data-active={category === null ? 'true' : undefined}
                aria-pressed={category === null}
                onClick={() => setCategory(null)}
              >
                all <span className="tabular text-[0.9em] opacity-70">{searched.filter((p) => matchesRest(p, { category: null })).length}</span>
              </button>
            </li>
            {categories.map((c) => {
              const count = categoryCounts.get(c) ?? 0;
              return (
                <li key={c}>
                  <button
                    type="button"
                    className="tag disabled:cursor-not-allowed disabled:opacity-45"
                    data-active={category === c ? 'true' : undefined}
                    aria-pressed={category === c}
                    disabled={count === 0 && category !== c}
                    onClick={() => setCategory(category === c ? null : c)}
                  >
                    {c}{' '}
                    <span className="tabular text-[0.9em] opacity-70">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="label mb-2">
            Tags{tags.length > 0 ? ` · ${tags.length} selected (all must match)` : ''}
          </h2>
          <ul
            className={
              showAllTags ? 'tag-row max-h-56 overflow-y-auto pr-1' : 'tag-row'
            }
          >
            {shownTags.map(([tag, count]) => (
              <li key={tag}>
                <button
                  type="button"
                  className="tag"
                  data-active={tags.includes(tag) ? 'true' : undefined}
                  aria-pressed={tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag} <span className="tabular text-[0.9em] opacity-70">{count}</span>
                </button>
              </li>
            ))}
          </ul>
          {(showAllTags || tagCounts.length > previewTags.length) && (
            <button
              type="button"
              className="meta link-quiet mt-2"
              aria-expanded={showAllTags}
              onClick={() => setShowAllTags((v) => !v)}
            >
              {showAllTags ? 'Show fewer tags' : `Show all ${tagCounts.length} tags`}
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <p className="meta" aria-live="polite">
            Showing {visible.length} of {projects.length} projects
          </p>
          {anyFilter && (
            <button type="button" className="meta link-quiet" onClick={clearAll}>
              Clear filters (Esc)
            </button>
          )}
        </div>
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
        <ul className="row-list">
          {visible.map((p) => (
            <li
              key={p.id}
              className="row lg:grid lg:grid-cols-[14rem_12.5rem_minmax(0,1fr)_auto] lg:items-baseline lg:gap-x-5"
            >
              <a className="row-title link-quiet block" href={`/projects/${p.id}/`}>
                {p.title}
              </a>

              <ul className="meta-row mt-1 lg:mt-0">
                <li className="tabular">{p.year}</li>
                <li>{p.category}</li>
                <li>{p.status}</li>
              </ul>

              <div className="mt-1.5 min-w-0 lg:mt-0">
                <p className="row-desc">{p.summary}</p>
                {p.tags.length > 0 && (
                  <ul className="tag-row mt-2">
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
              </div>

              <p className="meta mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:mt-0 lg:justify-end">
                {p.featured && <span className="text-ink-muted">selected</span>}
                {p.repo ? (
                  <a
                    className="link-quiet"
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    repo
                  </a>
                ) : (
                  p.private && <span>private</span>
                )}
                {p.open && (
                  <a
                    className="link-quiet"
                    href={p.open}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    open
                  </a>
                )}
                {p.demo && p.demo !== p.open && (
                  <a
                    className="link-quiet"
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    demo
                  </a>
                )}
                {p.paper && (
                  <a
                    className="link-quiet"
                    href={p.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    paper
                  </a>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

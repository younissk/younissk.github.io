import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import type { SearchEntry } from '../lib/searchIndex';

interface Props {
  entries: SearchEntry[];
}

/**
 * ⌘K / Ctrl-K palette over every page on the site.
 *
 * Additive by design: the whole index is server-rendered elsewhere and every
 * route is reachable by ordinary navigation, so with JavaScript off nothing is
 * lost — this is a shortcut, never the only way through.
 *
 * `/` is deliberately NOT bound. The projects page already uses it to focus its
 * own filter box, and stealing it there would be worse than not having it.
 */
export default function CommandPalette({ entries }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  /** Where focus came from, so Esc puts it back rather than dumping it on <body>. */
  const restoreRef = useRef<HTMLElement | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'detail', weight: 1 },
          { name: 'keywords', weight: 1 },
          { name: 'group', weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [entries],
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      // Empty state is a menu, not a void: the pages first, then recent work.
      return entries.filter((e) => e.group === 'page').slice(0, 8);
    }
    return fuse.search(q, { limit: 12 }).map((r) => r.item);
  }, [query, fuse, entries]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
    restoreRef.current?.focus();
  }, []);

  const openPalette = useCallback((seed?: string) => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    if (seed) setQuery(seed);
    setOpen(true);
  }, []);

  // Global shortcut, plus an event so the header button can open it too.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open ? close() : openPalette();
      }
    };
    const onOpen = (e: Event) => {
      const seed = (e as CustomEvent<{ query?: string }>).detail?.query;
      openPalette(seed);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, [open, close, openPalette]);

  useEffect(() => {
    if (!open) return;
    const el = inputRef.current;
    el?.focus();
    /* Caret after the seeded text, not before it. */
    const n = el?.value.length ?? 0;
    el?.setSelectionRange(n, n);
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = results[active];
      if (hit) window.location.href = hit.href;
    }
  };

  return (
    <div className="cp-backdrop" onMouseDown={close}>
      <div
        className="cp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search this site"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          className="cp-input"
          type="text"
          value={query}
          placeholder="Search projects, papers, writing…"
          aria-label="Search this site"
          aria-controls="cp-results"
          aria-activedescendant={results[active] ? `cp-opt-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setQuery(e.target.value)}
        />

        {results.length === 0 ? (
          <p className="cp-empty">No match for “{query.trim()}”.</p>
        ) : (
          <ul className="cp-results" id="cp-results" role="listbox" ref={listRef}>
            {results.map((r, i) => (
              <li key={r.href} role="presentation">
                <a
                  id={`cp-opt-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  className="cp-row"
                  data-active={i === active ? 'true' : undefined}
                  href={r.href}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="cp-row-main">
                    <span className="cp-row-title">{r.title}</span>
                    {r.detail && <span className="cp-row-detail">{r.detail}</span>}
                  </span>
                  <span className="cp-row-group">{r.group}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="cp-hint">
          <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>↵</kbd> to open · <kbd>esc</kbd> to close
        </p>
      </div>
    </div>
  );
}

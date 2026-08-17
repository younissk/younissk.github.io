import { useEffect, useState } from 'react';

interface Props {
  /** The raw BibTeX entry. Rendered verbatim and copied verbatim. */
  bibtex: string;
  /** Summary text for the disclosure. */
  label?: string;
  /** Paper title, used to disambiguate the button for screen readers. */
  describes?: string;
  /** Start expanded — used on paper detail pages, where the entry is the point. */
  defaultOpen?: boolean;
}

type CopyState = 'idle' | 'copied' | 'error';

/**
 * BibTeX disclosure with a copy button.
 *
 * The server-rendered markup is a plain <details> containing a <pre>, so the
 * entry is readable and selectable with JavaScript off. The button is mounted
 * only after hydration — a copy control that cannot copy is worse than none.
 */
export default function Bibtex({
  bibtex,
  label = 'BibTeX',
  describes,
  defaultOpen = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), 1500);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    if (!navigator.clipboard) {
      setState('error');
      return;
    }
    try {
      await navigator.clipboard.writeText(bibtex);
      setState('copied');
    } catch {
      setState('error');
    }
  }

  const buttonText =
    state === 'copied' ? 'Copied' : state === 'error' ? 'Copy failed' : 'Copy BibTeX';

  return (
    <details className="min-w-0" open={defaultOpen}>
      <summary className="label cursor-pointer select-none py-1 marker:text-border-strong hover:text-ink">
        {label}
      </summary>

      <div className="mt-2">
        {mounted && (
          <button
            type="button"
            className="btn mb-2 px-2.5 py-1 text-xs"
            onClick={copy}
            aria-label={describes ? `Copy the BibTeX entry for ${describes}` : 'Copy BibTeX entry'}
          >
            {buttonText}
          </button>
        )}
        <span role="status" aria-live="polite" className="sr-only">
          {state === 'copied' ? 'BibTeX copied to clipboard' : ''}
          {state === 'error' ? 'Could not copy — select the text below instead' : ''}
        </span>

        <pre className="overflow-x-auto rounded-panel border border-border bg-surface p-3 font-mono text-xs leading-relaxed text-ink-muted">
          <code>{bibtex.trim()}</code>
        </pre>
      </div>
    </details>
  );
}

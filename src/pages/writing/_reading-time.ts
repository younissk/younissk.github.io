/**
 * Reading time, computed from the real body text.
 *
 * Underscore-prefixed so Astro does not treat it as a route. Shared by the
 * writing index, the post detail page, the tag pages and the RSS feed so a
 * post never reports two different lengths.
 *
 * The count is deliberately of *prose*: fenced code, inline code, KaTeX,
 * image alt text, MDX imports and raw HTML tags are stripped first, because
 * nobody reads a 40-line code block at 220 words per minute.
 */

/** Average adult reading speed for technical prose. */
const WORDS_PER_MINUTE = 220;

/** Strip everything that is not read as prose, then count what is left. */
export function countWords(body: string | undefined): number {
  if (!body) return 0;

  const text = body
    // Frontmatter, if a loader ever hands it to us.
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, ' ')
    // Fenced code blocks (``` and ~~~).
    .replace(/^[ \t]*```[\s\S]*?^[ \t]*```/gm, ' ')
    .replace(/^[ \t]*~~~[\s\S]*?^[ \t]*~~~/gm, ' ')
    // MDX import/export statements.
    .replace(/^[ \t]*(?:import|export)\s.*$/gm, ' ')
    // Images: drop the whole node, alt text included.
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // Links: keep the label, drop the target.
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Math, display then inline.
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    // Inline code.
    .replace(/`[^`\n]*`/g, ' ')
    // Raw HTML / JSX tags.
    .replace(/<[^>]*>/g, ' ')
    // Markdown punctuation that would otherwise count as a "word".
    .replace(/[#*_>|~]/g, ' ')
    .replace(/^[ \t]*[-+][ \t]+/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return 0;
  // A token counts only if it contains a letter or a digit.
  return text.split(' ').filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

/** Whole minutes, never zero — a one-paragraph note is still "1 min". */
export function readingMinutes(body: string | undefined): number {
  return Math.max(1, Math.round(countWords(body) / WORDS_PER_MINUTE));
}

/** The string shown in metadata rows. */
export function readingTimeLabel(body: string | undefined): string {
  return `${readingMinutes(body)} min read`;
}

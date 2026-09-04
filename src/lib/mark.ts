/**
 * A deterministic mark for anything that has no photograph.
 *
 * Projects have no screenshots and papers have no cover, so those lists were
 * either imageless or filled with the generated social cards — which are just
 * the title on a black field, so on a card that already shows the title they
 * add nothing.
 *
 * Instead every entry gets its own frozen self-avoiding walk: the same
 * simulation that runs behind the landing page, seeded from the entry's slug
 * and stopped. The site already has a motif, and this is it. The mark is
 * stable — nanoBeard draws the same path forever — and distinct enough between
 * slugs to be recognisable in a list.
 *
 * Pure string output, rendered server-side into inline SVG. No image files, no
 * requests, no JavaScript, and it still works with the stylesheet missing.
 */

/** FNV-1a. Small, fast, and stable across engines and versions. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32: a seeded PRNG, so a slug always produces the same walk. */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Mark {
  /** `d` attribute for the walk. */
  path: string;
  /** Grid the path is drawn on, for the viewBox. */
  cols: number;
  rows: number;
  /** How much of the grid the walk covered, 0-1. Used to pick a stroke width. */
  coverage: number;
}

/**
 * Walk a small grid, never revisiting a cell, preferring the tightest corner
 * (Warnsdorff) so the path fills rather than wandering off and dying early.
 */
export function markFor(seed: string, cols = 11, rows = 6): Mark {
  const rand = rng(hash(seed));
  const taken = new Uint8Array(cols * rows);
  const at = (x: number, y: number) => y * cols + x;
  const inside = (x: number, y: number) => x >= 0 && x < cols && y >= 0 && y < rows;

  let x = Math.floor(rand() * cols);
  let y = Math.floor(rand() * rows);
  taken[at(x, y)] = 1;

  const points: Array<[number, number]> = [[x, y]];

  for (;;) {
    const options = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ].filter(([nx, ny]) => inside(nx, ny) && !taken[at(nx, ny)]) as Array<[number, number]>;

    if (options.length === 0) break;

    const free = ([nx, ny]: [number, number]) =>
      [
        [nx + 1, ny],
        [nx - 1, ny],
        [nx, ny + 1],
        [nx, ny - 1],
      ].filter(([ax, ay]) => inside(ax, ay) && !taken[at(ax, ay)]).length;

    let next: [number, number];
    if (rand() < 0.14) {
      next = options[Math.floor(rand() * options.length)];
    } else {
      let best = Infinity;
      let tied: Array<[number, number]> = [];
      for (const option of options) {
        const n = free(option);
        if (n < best) {
          best = n;
          tied = [option];
        } else if (n === best) {
          tied.push(option);
        }
      }
      next = tied[Math.floor(rand() * tied.length)];
    }

    [x, y] = next;
    taken[at(x, y)] = 1;
    points.push([x, y]);
  }

  const path = points
    .map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px} ${py}`)
    .join(' ');

  return { path, cols, rows, coverage: points.length / (cols * rows) };
}

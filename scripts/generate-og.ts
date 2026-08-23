/**
 * Open Graph card generation — writes `public/og/*.png`.
 *
 * Run with:  npm run og
 *
 * ---------------------------------------------------------------------------
 * THE PNGs ARE COMMITTED. THE BUILD DOES NOT RUN THIS.
 *
 * Same principle as the committed `docs/` folder (see SUCCESSION.md): the
 * publish path must not depend on a toolchain. `npm run build` reads
 * `public/og/` as ordinary static files — it never imports satori, and if
 * satori and resvg both disappear from npm tomorrow the site still builds and
 * still previews correctly everywhere it is shared.
 *
 * So this is a manual step. Add or rename a page, run `npm run og`, commit the
 * PNGs it produces. Nothing breaks if you forget — the page falls back to the
 * site-wide card — but its preview stops being specific.
 * ---------------------------------------------------------------------------
 *
 * Why the frontmatter is parsed by hand rather than read through
 * `astro:content`: that module only exists inside an Astro build. A standalone
 * script that imports it cannot run. The parsing below is deliberately small —
 * it reads `title` and `draft` and nothing else, because that is all a card
 * needs, and a card is not the place to discover a schema error.
 *
 * The route slug must match what Astro's glob loader generates, or a card ends
 * up with a filename no page ever asks for. Astro slugifies each path segment
 * (github-slugger rules) and drops a trailing `/index`, which is why
 * `projects/disco-v0.1.md` is served at `/projects/disco-v01/`. `slugSegment`
 * below reproduces that. If a future filename uses characters this does not
 * handle, the symptom is silent: that page falls back to the default card.
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

import { AUTHOR, NAV } from '../src/consts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const CONTENT_DIR = resolve(ROOT, 'src', 'content');
const FONT_DIR = resolve(HERE, 'fonts');
const OUT_DIR = resolve(ROOT, 'public', 'og');

const WIDTH = 1200;
const HEIGHT = 630;

/** Dark palette, copied from `--c-*` under `.dark` in src/styles/global.css. */
const INK = '#ececef';
const INK_MUTED = '#a7a7b1';
const INK_FAINT = '#7c7c87';
const BG = '#0d0d0f';
const RULE = '#3d3d46';

/** Page margin. Generous on purpose: several clients crop the card's edges. */
const PAD_X = 80;
const PAD_Y = 72;
const CONTENT_WIDTH = WIDTH - PAD_X * 2;

/** Largest first — the first size that fits the title in MAX_LINES wins. */
const TITLE_SIZES = [86, 74, 64, 56] as const;
const MAX_LINES = 3;
const TITLE_TRACKING = -1.5;
const LINE_HEIGHT = 1.06;

// --- shapes ---------------------------------------------------------------

interface Card {
  /** Output filename without extension; mirrors the route with `/` → `-`. */
  name: string;
  /** Small tracked-out label above the title. */
  eyebrow: string;
  title: string;
}

// --- minimal element factory ----------------------------------------------

/**
 * satori wants React elements. This file is `.ts`, not `.tsx`, because
 * package.json runs it as `tsx scripts/generate-og.ts` and package.json is not
 * ours to edit — so the two-field shape satori actually consumes is built by
 * hand. It is the same object JSX would have compiled to.
 */
type Style = Record<string, string | number>;
interface El {
  type: string;
  props: { style?: Style; children?: El[] | string };
}

function box(style: Style, children?: El[] | string): El {
  return { type: 'div', props: { style, children } };
}

// --- text measurement ------------------------------------------------------

/**
 * Approximate advance widths for Inter, in em, keyed loosely by glyph class.
 *
 * satori can wrap text itself, but then the script cannot know how many lines
 * came out, and the whole point here is to pick the largest size that still
 * fits in three. So the wrapping is done here and each line is emitted as its
 * own element — satori never has to make a line-breaking decision.
 *
 * These numbers are estimates, not metrics read from the font file. They are
 * biased slightly wide (see SAFETY), because the failure modes are asymmetric:
 * overestimating breaks a line one word early, underestimating pushes text off
 * the edge of the card.
 */
const CHAR_WIDTH: ReadonlyArray<readonly [RegExp, number]> = [
  [/[ ]/, 0.26],
  [/[iljI|.,:;'!`]/, 0.31],
  [/[ftr()[\]{}/\\-]/, 0.37],
  [/[MW]/, 0.92],
  [/[mw]/, 0.85],
  [/[A-Z]/, 0.68],
  [/[0-9]/, 0.6],
];
const DEFAULT_CHAR_WIDTH = 0.56;
const SAFETY = 1.04;

function textWidth(text: string, size: number, tracking: number): number {
  let em = 0;
  for (const char of text) {
    const match = CHAR_WIDTH.find(([pattern]) => pattern.test(char));
    em += match ? match[1] : DEFAULT_CHAR_WIDTH;
  }
  return em * size * SAFETY + tracking * text.length;
}

/** Greedy wrap. Words longer than a line are hard-broken rather than dropped. */
function wrap(text: string, size: number, max: number): string[] {
  const lines: string[] = [];
  let line = '';

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (textWidth(candidate, size, TITLE_TRACKING) <= max) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);

    // A single word wider than the column: break it character by character.
    let rest = word;
    while (textWidth(rest, size, TITLE_TRACKING) > max) {
      let cut = rest.length;
      while (cut > 1 && textWidth(rest.slice(0, cut), size, TITLE_TRACKING) > max) cut--;
      lines.push(rest.slice(0, cut));
      rest = rest.slice(cut);
    }
    line = rest;
  }

  if (line) lines.push(line);
  return lines;
}

/** Trim a line until it and a trailing ellipsis fit the column. */
function ellipsize(line: string, size: number, max: number): string {
  let text = line;
  while (text.length > 1 && textWidth(`${text}…`, size, TITLE_TRACKING) > max) {
    text = text.slice(0, -1).trimEnd();
  }
  return `${text}…`;
}

/** Largest size whose wrap fits in MAX_LINES; the smallest size truncates. */
function layoutTitle(title: string): { size: number; lines: string[] } {
  for (const size of TITLE_SIZES) {
    const lines = wrap(title, size, CONTENT_WIDTH);
    if (lines.length <= MAX_LINES) return { size, lines };
  }

  const size = TITLE_SIZES[TITLE_SIZES.length - 1];
  const lines = wrap(title, size, CONTENT_WIDTH).slice(0, MAX_LINES);
  lines[MAX_LINES - 1] = ellipsize(lines[MAX_LINES - 1], size, CONTENT_WIDTH);
  return { size, lines };
}

// --- the card ---------------------------------------------------------------

/**
 * A typeset card, not a logo on a gradient: eyebrow, title, hairline,
 * signature row. The title is bottom-aligned against the rule so a one-line
 * card and a three-line card share the same baseline.
 *
 * The eyebrow and footer would be monospace on the site. Only Inter ships in
 * scripts/fonts/ (see the README there — the whole point is that generation
 * never touches the network), so they are set in Inter, uppercase and tracked
 * out, which reads as metadata at preview size.
 */
function card({ eyebrow, title }: Card): El {
  const { size, lines } = layoutTitle(title);

  return box(
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: `${WIDTH}px`,
      height: `${HEIGHT}px`,
      padding: `${PAD_Y}px ${PAD_X}px`,
      backgroundColor: BG,
      fontFamily: 'Inter',
    },
    [
      box(
        {
          display: 'flex',
          fontSize: '22px',
          fontWeight: 400,
          letterSpacing: '4px',
          color: INK_FAINT,
        },
        eyebrow.toUpperCase(),
      ),

      box(
        { display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'flex-end' },
        lines.map((line) =>
          box(
            {
              display: 'flex',
              fontSize: `${size}px`,
              fontWeight: 700,
              letterSpacing: `${TITLE_TRACKING}px`,
              lineHeight: LINE_HEIGHT,
              color: INK,
            },
            line,
          ),
        ),
      ),

      box({ display: 'flex', flexDirection: 'column' }, [
        box({
          display: 'flex',
          height: '1px',
          backgroundColor: RULE,
          marginTop: '48px',
          marginBottom: '28px',
        }),
        box(
          {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '22px',
            letterSpacing: '1px',
            color: INK_MUTED,
          },
          [
            box({ display: 'flex' }, AUTHOR.name),
            box({ display: 'flex' }, 'youniss.dev'),
          ],
        ),
      ]),
    ],
  );
}

// --- content ---------------------------------------------------------------

/**
 * github-slugger's rules, narrowed to what filenames in this repo can contain:
 * lowercase, spaces to hyphens, punctuation dropped. `disco-v0.1` → `disco-v01`.
 */
function slugSegment(segment: string): string {
  return segment
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, '')
    .replace(/\s+/g, '-');
}

/** The id Astro's glob loader gives a file, relative to its collection dir. */
function entryId(relativePath: string): string {
  return relativePath
    .replace(/\.(md|mdx)$/, '')
    .split('/')
    .map(slugSegment)
    .join('/')
    .replace(/\/index$/, '');
}

interface Frontmatter {
  title?: string;
  draft: boolean;
}

/**
 * Reads `title` and `draft` out of a YAML frontmatter block. Not a YAML parser
 * and not trying to be: it handles the two shapes these files actually use,
 * `key: value` and `key: "value"`, and ignores everything nested.
 */
function frontmatter(file: string): Frontmatter {
  const source = readFileSync(file, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { draft: false };

  const result: Frontmatter = { draft: false };
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^(title|draft):\s*(.*)$/);
    if (!pair) continue;

    const raw = pair[2].trim();
    if (pair[1] === 'draft') {
      result.draft = raw === 'true';
      continue;
    }
    result.title = raw
      .replace(/^["'](.*)["']$/s, '$1')
      .replace(/\\"/g, '"')
      .trim();
  }
  return result;
}

/** Every markdown file under a collection, as paths relative to its directory. */
function collectionFiles(collection: string): string[] {
  const base = join(CONTENT_DIR, collection);
  const found: string[] = [];

  const walk = (dir: string, prefix: string) => {
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full, `${prefix}${name}/`);
      } else if (/\.(md|mdx)$/.test(name)) {
        found.push(`${prefix}${name}`);
      }
    }
  };

  walk(base, '');
  return found;
}

/**
 * Cards for one collection. `routeBase` is the URL segment, which is not always
 * the collection name — posts live in `posts/` and are served under `/writing/`.
 */
function collectionCards(collection: string, routeBase: string, eyebrow: string): Card[] {
  return collectionFiles(collection)
    .map((relative) => ({ relative, data: frontmatter(join(CONTENT_DIR, collection, relative)) }))
    .filter(({ relative, data }) => {
      if (data.draft) return false; // No page is generated for a draft.
      if (!data.title) {
        throw new Error(`No title in frontmatter: src/content/${collection}/${relative}`);
      }
      return true;
    })
    .map(({ relative, data }) => ({
      name: `${routeBase}-${entryId(relative)}`,
      eyebrow,
      title: data.title as string,
    }));
}

/** The nav blurb for a section, so index cards quote the site's own copy. */
function blurb(href: string): string {
  const item = NAV.find((entry) => entry.href === href);
  if (!item) throw new Error(`No NAV entry for ${href} — consts.ts and this script disagree.`);
  return item.blurb;
}

function allCards(): Card[] {
  return [
    { name: 'index', eyebrow: AUTHOR.role, title: AUTHOR.name },
    { name: 'library', eyebrow: 'Library', title: 'Writing, papers and videos' },
    { name: 'projects', eyebrow: 'Projects', title: blurb('/projects/') },
    { name: 'contact', eyebrow: 'Contact', title: blurb('/contact/') },
    { name: 'now', eyebrow: 'Now', title: 'What I am working on right now' },
    { name: 'uses', eyebrow: 'Uses', title: 'The tools I actually work in' },

    ...collectionCards('work', 'work', 'Work'),
    ...collectionCards('projects', 'projects', 'Project'),
    ...collectionCards('papers', 'papers', 'Paper'),
    ...collectionCards('posts', 'writing', 'Writing'),
  ];
}

// --- render ----------------------------------------------------------------

async function main(): Promise<void> {
  const fonts = [
    { name: 'Inter', data: readFileSync(join(FONT_DIR, 'Inter-400.ttf')), weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: readFileSync(join(FONT_DIR, 'Inter-700.ttf')), weight: 700 as const, style: 'normal' as const },
  ];

  mkdirSync(OUT_DIR, { recursive: true });

  const cards = allCards();
  const names = new Set<string>();

  for (const entry of cards) {
    if (names.has(entry.name)) {
      throw new Error(`Two pages want og/${entry.name}.png — routes collide.`);
    }
    names.add(entry.name);

    const svg = await satori(card(entry) as never, { width: WIDTH, height: HEIGHT, fonts });
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
    writeFileSync(join(OUT_DIR, `${entry.name}.png`), png);
  }

  // Anything left over is a card for a page that no longer exists. Say so
  // rather than deleting it — a stale file is cheap, a wrong deletion is not.
  const stale = readdirSync(OUT_DIR)
    .filter((file) => file.endsWith('.png'))
    .filter((file) => !names.has(file.replace(/\.png$/, '')));

  console.log(`og: wrote ${cards.length} cards at ${WIDTH}x${HEIGHT} to public/og/`);
  if (stale.length > 0) {
    console.log(`og: ${stale.length} file(s) match no page, delete by hand: ${stale.join(', ')}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

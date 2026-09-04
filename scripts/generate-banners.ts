/**
 * Card banners for the projects that have no banner of their own.
 *
 * Five projects ship a real banner in their repo (nanoBeard, DISCO, Falcon
 * Twig, Tython, tool-calling-mix) and those are committed under public/banners/
 * as-is. This script draws the rest.
 *
 * Each one is built from the project's OWN visual language rather than from a
 * house template — Shopify Search's palette is lifted from its globals.css,
 * PaperNavigator's from its live site — so the row of cards reads as thirteen
 * different pieces of work instead of thirteen variations on one card.
 *
 * Deliberately almost text-free. A banner that just prints the title sits
 * directly above the title and says nothing twice; these carry the shape of the
 * thing instead.
 *
 * Run by hand with `npm run banners`, output committed. Nothing here runs at
 * build time or in the publish path, same rule as the OG cards.
 */
import { mkdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const HERE = dirname(fileURLToPath(import.meta.url));
const FONT_DIR = resolve(HERE, 'fonts');
const OUT_DIR = resolve(HERE, '..', 'public', 'banners');

/** 3:1, matching the aspect the project cards render at. */
const WIDTH = 1200;
const HEIGHT = 400;

type Node = Record<string, unknown>;
const box = (style: Record<string, unknown>, children?: unknown): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

/* -------------------------------------------------------------------------
   PaperNavigator — papernavigator.com
   Near-white ground, mono type with a red offset shadow, and the document
   motif from its hero. Documents cascade left to right, getting further along
   the pipeline: blank, then ruled, then ranked.
   ------------------------------------------------------------------------- */
function paperNavigator(): Node {
  const PAPER = '#f7f8fa';
  const INK = '#16161a';
  const RED = '#ff5a5f';

  const doc = (i: number) => {
    const lines = Math.min(i, 4);
    return box(
      {
        position: 'relative',
        width: '116px',
        height: '150px',
        marginRight: '26px',
        transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + i)}deg) translateY(${i * 8}px)`,
      },
      [
        /* The offset shadow is the site's signature. */
        box({
          position: 'absolute',
          left: '6px',
          top: '6px',
          width: '116px',
          height: '150px',
          backgroundColor: RED,
        }),
        box(
          {
            position: 'absolute',
            width: '116px',
            height: '150px',
            backgroundColor: PAPER,
            border: `3px solid ${INK}`,
            flexDirection: 'column',
            padding: '16px 14px',
          },
          Array.from({ length: lines }, (_, l) =>
            box({
              width: `${88 - l * 13}%`,
              height: '9px',
              backgroundColor: INK,
              marginBottom: '11px',
              opacity: 1 - l * 0.16,
            }),
          ),
        ),
      ],
    );
  };

  return box(
    {
      width: '100%',
      height: '100%',
      backgroundColor: PAPER,
      alignItems: 'center',
      paddingLeft: '70px',
      overflow: 'hidden',
    },
    [
      box({ alignItems: 'flex-start' }, [0, 1, 2, 3, 4, 5, 6].map(doc)),
    ],
  );
}

/* -------------------------------------------------------------------------
   Shopify Search
   Palette taken verbatim from frontend/app/globals.css: a deep maroon ground,
   pale yellow ink, green accent, and the generous 20px radii the app uses
   everywhere. Reads as a shelf of products, which is what it searches.
   ------------------------------------------------------------------------- */
function shopifySearch(): Node {
  const GROUND = '#1C0F13';
  const YELLOW = '#F8F17F';
  const GREEN = '#5B995A';

  const tile = (i: number) => {
    const green = i % 3 === 1;
    return box(
      {
        width: '128px',
        height: '128px',
        marginRight: '22px',
        borderRadius: '20px',
        backgroundColor: green ? GREEN : 'rgba(248, 241, 127, 0.10)',
        border: `2px solid ${green ? GREEN : 'rgba(248, 241, 127, 0.28)'}`,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '14px',
      },
      [
        box({
          width: `${52 + ((i * 13) % 40)}%`,
          height: '10px',
          borderRadius: '5px',
          backgroundColor: green ? GROUND : YELLOW,
          opacity: green ? 0.85 : 0.55,
        }),
      ],
    );
  };

  return box(
    {
      width: '100%',
      height: '100%',
      backgroundColor: GROUND,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 64px',
      overflow: 'hidden',
    },
    [
      /* The search field, rounded the way the app rounds things. */
      box(
        {
          width: '620px',
          height: '68px',
          borderRadius: '34px',
          border: `2px solid rgba(248, 241, 127, 0.30)`,
          alignItems: 'center',
          padding: '0 26px',
          marginBottom: '34px',
        },
        [
          box({
            width: '22px',
            height: '22px',
            borderRadius: '11px',
            border: `3px solid ${YELLOW}`,
            marginRight: '18px',
            opacity: 0.9,
          }),
          box({
            width: '300px',
            height: '12px',
            borderRadius: '6px',
            backgroundColor: YELLOW,
            opacity: 0.35,
          }),
        ],
      ),
      box({}, [0, 1, 2, 3, 4, 5, 6].map(tile)),
    ],
  );
}

/* -------------------------------------------------------------------------
   The JKU work — TempBench, embed2image, the exam simulator.
   A shared institutional plate so the three read as one body of work.

   Deliberately NOT the university's logo: that is their trademark, and putting
   it on a personal site implies an endorsement nobody gave. The name set as
   type states the same fact and claims nothing.
   ------------------------------------------------------------------------- */
function jku(label: string, accent: string): Node {
  const GROUND = '#0b0b0d';

  return box(
    {
      width: '100%',
      height: '100%',
      backgroundColor: GROUND,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 70px',
      position: 'relative',
      overflow: 'hidden',
    },
    [
      /* A quiet field of rules, echoing the grid the site draws elsewhere. */
      box(
        { position: 'absolute', top: '0px', left: '0px', width: '1200px', height: '400px' },
        Array.from({ length: 24 }, (_, i) =>
          box({
            position: 'absolute',
            left: `${i * 52}px`,
            top: '0px',
            width: '1px',
            height: '400px',
            backgroundColor: accent,
            opacity: 0.14,
          }),
        ),
      ),
      box(
        {
          fontFamily: 'Inter',
          fontSize: '96px',
          fontWeight: 700,
          color: accent,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        },
        'JKU',
      ),
      box(
        {
          fontFamily: 'Inter',
          fontSize: '26px',
          fontWeight: 400,
          color: '#e8e8ea',
          opacity: 0.72,
          marginTop: '18px',
          letterSpacing: '0.02em',
        },
        label,
      ),
    ],
  );
}

const BANNERS: Array<{ name: string; node: Node }> = [
  { name: 'papernavigator', node: paperNavigator() },
  { name: 'shopify-search', node: shopifySearch() },
  { name: 'tempbench-temporal-lalm-reasoning-benchmark', node: jku('Institute of Computational Perception', '#7dd3fc') },
  { name: 'embed2image-contrastive-retrieval', node: jku('Institute of Computational Perception', '#c4b5fd') },
  { name: 'jku-exam-practice', node: jku('Exam simulator', '#ffe400') },
];

async function main(): Promise<void> {
  const fonts = [
    { name: 'Inter', data: readFileSync(join(FONT_DIR, 'Inter-400.ttf')), weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: readFileSync(join(FONT_DIR, 'Inter-700.ttf')), weight: 700 as const, style: 'normal' as const },
  ];

  mkdirSync(OUT_DIR, { recursive: true });

  for (const { name, node } of BANNERS) {
    const svg = await satori(node as never, { width: WIDTH, height: HEIGHT, fonts });
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
    const out = join(OUT_DIR, `${name}.webp`);
    await sharp(png).webp({ quality: 86 }).toFile(out);

    /* satori writes nothing else, but an older PNG from a previous run would
       shadow the webp in the lookup. */
    const stalePng = join(OUT_DIR, `${name}.png`);
    if (existsSync(stalePng)) unlinkSync(stalePng);
  }

  console.log(`banners: wrote ${BANNERS.length} at ${WIDTH}x${HEIGHT} to public/banners/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

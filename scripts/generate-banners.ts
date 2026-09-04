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
const ART_DIR = resolve(HERE, 'art');
const FONT_DIR = resolve(HERE, 'fonts');
const OUT_DIR = resolve(HERE, '..', 'public', 'banners');

/** 3:1, matching the aspect the project cards render at. */
const WIDTH = 1200;
const HEIGHT = 400;

/** Inline an image so satori never reaches the network. */
const dataUri = (buf: Buffer, mime = 'image/png') =>
  `data:${mime};base64,${buf.toString('base64')}`;

/**
 * A black-on-white logo, turned into white-on-transparent.
 *
 * The JKU wordmark ships as greyscale on white. Negating it alone would leave a
 * black plate around the glyph; instead the negated image becomes the alpha
 * channel of a solid white one, so only the letterforms survive. Pure
 * monochrome, so the inversion is exact — the same trick the site header uses
 * on the square-Kufic avatar.
 */
async function whiteOnTransparent(file: string): Promise<Buffer> {
  const src = sharp(resolve(ART_DIR, file));
  const { width, height } = await src.metadata();
  const alpha = await sharp(resolve(ART_DIR, file)).greyscale().negate().toColourspace('b-w').toBuffer();
  return sharp({
    create: { width: width!, height: height!, channels: 3, background: '#ffffff' },
  })
    .joinChannel(alpha, { raw: undefined })
    .png()
    .toBuffer();
}

/** Pixel art has to be resampled nearest-neighbour or it turns to mush. */
async function pixelUpscale(file: string, scale: number): Promise<Buffer> {
  const src = sharp(resolve(ART_DIR, file));
  const { width, height } = await src.metadata();
  return src
    .resize({ width: width! * scale, height: height! * scale, kernel: 'nearest' })
    .png()
    .toBuffer();
}

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
   nanoBeard
   Taken from the project's own site rather than its README banner: the
   parchment ground, the brown ink and the actual pixel ship sprites it uses
   for its model classes. Sloop, frigate and galleon are the real assets,
   upscaled nearest-neighbour so they stay pixels.
   ------------------------------------------------------------------------- */
function nanoBeard(ships: {
  sloop: string;
  frigate: string;
  galleon: string;
  captain: string;
}): Node {
  const BG = '#EAD7CE';
  const INK = '#2b1d12';
  const MUTED = '#6b5844';

  const ship = (src: string, w: number, h: number, bottom: number, left: number) =>
    box({
      position: 'absolute',
      left: `${left}px`,
      bottom: `${bottom}px`,
      width: `${w}px`,
      height: `${h}px`,
    }, {
      type: 'img',
      props: { src, width: w, height: h, style: { width: `${w}px`, height: `${h}px` } },
    });

  /* A pixel swell: stepped blocks rather than a curve. */
  const wave = (y: number, opacity: number) =>
    box(
      { position: 'absolute', left: '0px', bottom: `${y}px`, width: '1200px', height: '10px' },
      Array.from({ length: 40 }, (_, i) =>
        box({
          position: 'absolute',
          left: `${i * 30}px`,
          bottom: `${(i % 3) * 5}px`,
          width: '30px',
          height: '10px',
          backgroundColor: MUTED,
          opacity,
        }),
      ),
    );

  return box(
    {
      width: '100%',
      height: '100%',
      backgroundColor: BG,
      position: 'relative',
      overflow: 'hidden',
    },
    [
      wave(56, 0.18),
      wave(30, 0.28),
      box({
        position: 'absolute',
        left: '0px',
        bottom: '0px',
        width: '1200px',
        height: '34px',
        backgroundColor: INK,
        opacity: 0.82,
      }),
      /* The fleet runs left; the captain comes up behind it. He is the sprite
         that chases the ships on the project's own site, so the banner is the
         same gag rather than a still life of boats. */
      ship(ships.frigate, 288, 182, 76, 40),
      ship(ships.galleon, 212, 212, 66, 372),
      ship(ships.sloop, 152, 133, 82, 650),
      /* Bigger than anything he is chasing, and low enough to be in the water
         rather than hovering over it. */
      ship(ships.captain, 246, 305, 40, 872),
    ],
  );
}

/* -------------------------------------------------------------------------
   The JKU work — TempBench, embed2image, the exam simulator.

   Uses the university's own marks, at Youniss's explicit direction. I had
   drawn a typographic stand-in instead, on the grounds that a trademark on a
   personal site can imply an endorsement nobody gave; he owns that call and
   made it. The wordmark is greyscale so it inverts exactly for a dark ground;
   the institute logo is two-colour and would invert into the wrong colours, so
   it sits on its own white plate the way brand guidelines normally require.
   ------------------------------------------------------------------------- */
function jku(wordmark: string, institute: string | null, accent: string): Node {
  const GROUND = '#0b0b0d';

  return box(
    {
      width: '100%',
      height: '100%',
      backgroundColor: GROUND,
      alignItems: 'center',
      padding: '0 78px',
      position: 'relative',
      overflow: 'hidden',
    },
    [
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
            opacity: 0.12,
          }),
        ),
      ),
      box({ width: '360px', height: '180px' }, {
        type: 'img',
        props: { src: wordmark, width: 360, height: 180, style: { width: '360px', height: '180px' } },
      }),
      ...(institute
        ? [
            box({
              width: '2px',
              height: '150px',
              backgroundColor: accent,
              opacity: 0.5,
              marginLeft: '54px',
              marginRight: '54px',
            }),
            box(
              {
                backgroundColor: '#ffffff',
                padding: '22px 26px',
                borderRadius: '2px',
              },
              {
                type: 'img',
                props: { src: institute, width: 340, height: 92, style: { width: '340px', height: '92px' } },
              },
            ),
          ]
        : []),
    ],
  );
}

async function main(): Promise<void> {
  const fonts = [
    { name: 'Inter', data: readFileSync(join(FONT_DIR, 'Inter-400.ttf')), weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: readFileSync(join(FONT_DIR, 'Inter-700.ttf')), weight: 700 as const, style: 'normal' as const },
  ];

  /* Every asset is inlined as a data URI, so satori makes no network call and
     the generator works with no connection. */
  const wordmark = dataUri(await whiteOnTransparent('jku.jpg'));
  const institute = dataUri(readFileSync(resolve(ART_DIR, 'jku-cp.png')));
  const ships = {
    sloop: dataUri(await pixelUpscale('sloop.png', 10)),
    frigate: dataUri(await pixelUpscale('frigate.png', 10)),
    galleon: dataUri(await pixelUpscale('galleon.png', 11)),
    /* Mouth open — the chasing pose, not the idle one. */
    captain: dataUri(await pixelUpscale('nanobeard-open.png', 14)),
  };

  const banners: Array<{ name: string; node: Node }> = [
    { name: 'nanobeard', node: nanoBeard(ships) },
    { name: 'papernavigator', node: paperNavigator() },
    { name: 'shopify-search', node: shopifySearch() },
    { name: 'tempbench-temporal-lalm-reasoning-benchmark', node: jku(wordmark, institute, '#7dd3fc') },
    { name: 'embed2image-contrastive-retrieval', node: jku(wordmark, institute, '#c4b5fd') },
    { name: 'jku-exam-practice', node: jku(wordmark, null, '#ffe400') },
  ];

  mkdirSync(OUT_DIR, { recursive: true });

  for (const { name, node } of banners) {
    const svg = await satori(node as never, { width: WIDTH, height: HEIGHT, fonts });
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
    await sharp(png).webp({ quality: 88 }).toFile(join(OUT_DIR, `${name}.webp`));

    const stalePng = join(OUT_DIR, `${name}.png`);
    if (existsSync(stalePng)) unlinkSync(stalePng);
  }

  console.log(`banners: wrote ${banners.length} at ${WIDTH}x${HEIGHT} to public/banners/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

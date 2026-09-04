# youniss.dev

Personal site of Youniss: the full project archive, papers, videos and a small
blog.

Astro 7 · Tailwind CSS 4 (CSS-first, no config file) · MDX · published by GitHub
Pages from committed HTML.

**Built for longevity.** The finished site is committed to `docs/` and served
directly — no CI, no build step, no third-party service in the *serving* path.
(Two scheduled Actions do rebuild and push `docs/`; if they break, the last good
build keeps serving.) If this toolchain stops working, the HTML still does. Read
[SUCCESSION.md](SUCCESSION.md) before changing how it deploys.

## Run it

```sh
npm install      # once
npm run dev      # http://localhost:4321
npm run build    # regenerates docs/ — COMMIT the result, it is the published site
npm run preview  # serve the built site
```

Node 22.12+ is required (see `engines` in `package.json`).

## How the site is put together

```
src/
  consts.ts            site title, description, author, NAV, SOCIALS
  content.config.ts    every content collection + its schema
  styles/global.css    design tokens, base styles, shared component classes
  layouts/
    BaseLayout.astro   html shell, theme bootstrap, header/footer
  components/          Head, Header, Footer, Prose, Tag, PageHeader, ExternalLink
  content/<name>/      Markdown for each collection
  pages/               routes
public/
  img/                 project cover images
  papers/              PDFs served at /papers/<file>.pdf
  assets/covers/       post cover images
```

### Content collections

| Collection | Lives in                | One entry is                                  |
| ---------- | ----------------------- | --------------------------------------------- |
| `work`     | `src/content/work/`     | a case study — **unpublished**: all entries are `draft: true` and no route renders them |
| `projects` | `src/content/projects/` | one repository in the archive                 |
| `posts`    | `src/content/posts/`    | a blog post                                   |
| `papers`   | `src/content/papers/`   | a report, thesis or publication               |
| `videos`   | `src/content/videos/`   | extras for one YouTube video, keyed by video ID |

All five load `**/*.{md,mdx}` via the `glob` loader. The entry **id is the
filename** — Astro 5+ has no `entry.slug`, use `entry.id`. Schemas are in
`src/content.config.ts`; add a field there before using it in frontmatter, or
the build fails loudly (which is the point).

Empty collections are legal — each directory keeps a `.gitkeep` so the glob
loader always has a base directory to look at.

Maths is available in any Markdown file: `remark-math` + `rehype-katex` are
wired in `astro.config.mjs`, and KaTeX styles ship with `global.css`.

### Videos

Video metadata is **not** hand-written. The YouTube channel
(`@youniss-ml`) is the source of truth: a sync step reads the channel feed and
writes the video list (id, title, published date, thumbnail, duration) into a
generated data file, which the `/videos` pages read at build time. Re-running
the sync and committing the result is what publishes a new video to the site —
there is no runtime API call and no key in the browser.

The `videos` **collection** holds only the things the feed cannot know:
curated `resources` links and `notes`. Create
`src/content/videos/<youtube-video-id>.md` to attach them; a video without a
file simply renders without extras.

## Theming

Light and dark are both first-class. `BaseLayout` runs a tiny inline script
before first paint that reads `localStorage.theme`, falls back to
`prefers-color-scheme`, and puts `.dark` on `<html>` — so there is no flash of
the wrong theme. The header toggle writes the same key.

Colours are raw `--c-*` CSS variables redefined under `.dark`, exposed to
Tailwind through `@theme inline` as `bg-bg`, `text-ink`, `border-border`, and
friends. One class flip re-themes the document; no `dark:` variant is needed for
colour.

## Deployment

GitHub Pages serves the `docs/` folder on `main`. There is no build server.

```sh
npm run build
git add -A && git commit -m "..." && git push
```

That is the entire deploy. A change to `src/` that is not followed by a rebuild
changes nothing anyone can see.

Three things in `docs/` are load-bearing. Two come from `public/`:

- **`.nojekyll`** — without it GitHub runs Jekyll, which skips folders beginning
  with `_`, and every stylesheet and script lives in `docs/_astro/`. Delete it
  and the site renders as unstyled text.
- **`CNAME`** — the custom domain. Remove it and the site serves at
  `https://younissk.github.io/` instead. Nothing else breaks; every internal
  link is root-relative.

And one that does not:

- **`thumbs/`** — the YouTube thumbnails. Its source is `public/thumbs/`, which
  is tracked precisely so a rebuild cannot wipe it. `npm run sync:youtube`
  downloads each thumbnail once and rewrites `videos.json` to point at
  `/thumbs/...`, so nothing re-fetches them afterwards.

No security-header file: GitHub Pages does not support custom headers. It serves
HTTPS with HSTS on the apex domain. The site sets no cookies and loads nothing
from a third party; the one outbound request is the contact form POSTing to
Web3Forms when someone submits it. See SUCCESSION.md for why that trade exists.

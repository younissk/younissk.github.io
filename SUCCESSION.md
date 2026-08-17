# If you found this and I'm not around

This repository is my personal site, youniss.dev. It was built to be readable
long after I stop maintaining it, and you are explicitly allowed to keep it
running, move it, or mirror it. See LICENSE — content is CC BY 4.0, code is MIT.
You do not need permission from anyone.

This file exists because most personal sites die quietly: a card expires, a
build breaks, a host shuts down, and a few years of someone's work stops being
reachable. Everything below is an attempt to make that not happen here.

— Youniss Kandah

---

## The one thing to understand

**The site does not need to be built to be served.**

`docs/` contains the finished HTML, CSS, JavaScript and images. GitHub Pages
serves that folder directly. There is no build step in the publish path, no CI,
no Node, no npm, no package registry.

If every tool used to make this site is dead — Astro gone, Node gone, npm gone,
the whole JavaScript ecosystem unrecognisable — `docs/` still works. Copy it to
any static host, or open `docs/index.html` in a browser.

The source in `src/` is how it was made, not how it is served. It is a
convenience for editing, and it is allowed to rot.

## How it is published right now

- Repository: `younissk/younissk.github.io`
- GitHub Pages: Settings → Pages → Source: `main` branch, `/docs` folder
- `docs/.nojekyll` — **do not delete this.** Without it, GitHub runs Jekyll,
  which ignores folders starting with `_`, and `docs/_astro/` holds every
  stylesheet and script. The site renders as unstyled text without it.
- `public/CNAME` → `docs/CNAME` — the custom domain. Delete this file and the
  site simply serves at `https://younissk.github.io/` instead. Nothing breaks.

## The two ways this dies, and what to do

### 1. The domain lapses

`youniss.dev` is a registered domain with an annual fee. It is a lease. If it
is not renewed it will drop and someone else can buy it.

**This does not take the site down.** `https://younissk.github.io/` serves the
same content, for free, forever, with no renewal and no payment. If the domain
is gone, delete `public/CNAME`, rebuild or hand-edit `docs/CNAME` away, and
carry on.

Every internal link on this site is root-relative for exactly this reason. It
works identically at both addresses.

### 2. GitHub goes away, or the account does

Then the `younissk.github.io` URL goes with it. Recovery, in order of effort:

- **Any fork of this repository is a complete copy.** Push it anywhere that
  serves static files. There is nothing to configure beyond pointing at `docs/`.
- **Software Heritage** (https://softwareheritage.org) holds an archived copy of
  this repository. It is a public institution whose purpose is exactly this.
  Search for the repository URL.
- **The Internet Archive** (https://web.archive.org) has crawled the live site.
  Slower and lossier, but it is a fallback.

## If you want to change something

```bash
npm install
npm run dev          # local preview at http://localhost:4321
npm run build        # regenerates docs/
```

Then commit `docs/` along with your source change. **The built output must be
committed** — that is the whole design. A commit that changes `src/` without
rebuilding `docs/` changes nothing that anyone can see.

Content lives in `src/content/`:

| folder     | what it is |
|------------|------------|
| `work/`    | four long-form case studies |
| `projects/`| the full archive of everything I built |
| `posts/`   | writing |
| `papers/`  | publications, with BibTeX |
| `tools/`   | things other people can use |
| `videos/`  | optional extras attached to YouTube videos, keyed by video id |

If the build no longer works and you only want to fix a typo, **edit the HTML in
`docs/` directly**. It is plain, readable HTML. That is a legitimate way to
maintain this site and it will keep working long after the toolchain does not.

## Things that are deliberately absent

No analytics. No contact form backend. No comment system. No CDN. No web fonts
loaded from someone else's server. No tracking of any kind.

Every one of those would be a company that has to stay in business for this page
to keep rendering correctly. Fonts, styles, scripts and images are all served
from this repository. The only external requests a visitor makes are to links
they choose to click.

Please keep it that way. If you are tempted to add something, ask whether the
site still works in twenty years if that thing disappears.

## Archived earlier versions

Previous incarnations are preserved rather than deleted:

- **`archive/arcade`** — a branch in this repository, holding the original
  `younissk.github.io` landing page that this site replaced. Kept because
  overwriting `main` would otherwise have destroyed it.
- **`younissk/final-final-portfolio-hopefully`** — a separate repository holding
  the Docusaurus site that served youniss.dev until 2026. It is untouched, so it
  needs no copy here.

Neither is maintained. They are kept because deleting them would be a small,
permanent loss for no gain.

⚠️ `final-final-portfolio-hopefully` is currently a **private** repository. If it
stays private it is not really archived — nobody but the account owner can reach
it. Making it public is a one-line change in its GitHub settings and is worth
doing.

## A request, not a requirement

If you are keeping this alive: leave the writing as it was written, typos and
all. The point of it was that a person wrote it.

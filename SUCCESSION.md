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
serves that folder directly. There is no build step in the **serving** path, no
CI, no Node, no npm, no package registry.

Authoring is a different matter, and worth knowing about: two scheduled GitHub
Actions rebuild `docs/` and push it, so most of the commit history is theirs. If
they stop working nothing breaks — the last good `docs/` keeps serving. They are
authors, not the printing press.

If every tool used to make this site is dead — Astro gone, Node gone, npm gone,
the whole JavaScript ecosystem unrecognisable — `docs/` still works. Copy it to
any static host and it works.

Note that double-clicking `docs/index.html` will *not* work: every asset path is
root-relative (`/_astro/...`), which over `file://` resolves to the root of your
disk, so the page loads unstyled. Serve the folder instead — `python3 -m
http.server` inside `docs/` is enough.

The source in `src/` is how it was made, not how it is served. It is a
convenience for editing, and it is allowed to rot.

## How it is published right now

- Repository: `younissk/younissk.github.io`
- GitHub Pages: Settings → Pages → Source: `main` branch, `/docs` folder
- `docs/.nojekyll` — **do not delete this.** Without it, GitHub runs Jekyll,
  which ignores folders starting with `_`, and `docs/_astro/` holds every
  stylesheet and script. The site renders as unstyled text without it.
- The custom domain **is live**. `public/CNAME` contains `youniss.dev` and the
  build copies it to `docs/CNAME`. `https://younissk.github.io/` redirects to it.
  Deleting both CNAME files and rebuilding returns the site to
  `https://younissk.github.io/` and nothing else breaks — see "The domain
  lapses" below.
- `public/thumbs/` holds the YouTube thumbnails and **is tracked on purpose**.
  It has no other source: the sync downloads each one once, and `videos.json`
  then points at `/thumbs/...` forever. Deleting it means `npm run build`
  produces a `docs/` with 81 broken images.

## The robots

Two scheduled workflows in `.github/workflows/` write to `main`. Both fetch
data, rebuild `docs/`, and commit only if something changed.

| workflow | when | what it touches | needs |
|---|---|---|---|
| `sync-youtube.yml` | nightly, 04:17 UTC | `src/data/videos.json`, `public/thumbs/`, `docs/` | `YT_API_KEY`, `YT_CHANNEL_ID` |
| `sync-metrics.yml` | Mondays, 05:23 UTC | `src/data/metrics.json`, `docs/` | `GITHUB_TOKEN` (automatic) |

Neither is required for the site to serve. If the API keys expire, the workflow
fails loudly and the last committed data keeps being published. Delete both
files and the site carries on exactly as it is, frozen at the last sync.

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
- **Software Heritage** (https://softwareheritage.org) is a public institution
  whose purpose is exactly this. ⚠️ As of September 2026 this repository is
  **not yet archived there** — I checked, and the archive returns not-found.
  Archiving it takes one form: "Save Code Now", paste the repository URL. Try
  the archive anyway in case I got to it; if it is not there, a fork covers the
  same ground.
- **The Internet Archive** (https://web.archive.org) has crawled the live site.
  Slower and lossier, but it is a fallback.

## If you want to change something

```bash
npm install
npm run dev          # local preview at http://localhost:4321
npm run build        # regenerates docs/
```

Node 22.12 or newer. Three further scripts exist and are not part of a normal
edit:

```bash
npm run sync:youtube # refresh src/data/videos.json + public/thumbs/ from YouTube
npm run sync:metrics # refresh src/data/metrics.json (stars, model downloads)
npm run og           # regenerate the social cards in public/og/
```

Then commit `docs/` along with your source change. **The built output must be
committed** — that is the whole design. A commit that changes `src/` without
rebuilding `docs/` changes nothing that anyone can see.

Content lives in `src/content/`:

| folder     | what it is |
|------------|------------|
| `work/`    | four case studies that are **not published** — all are `draft: true`, and no route renders this collection |
| `projects/`| the full archive of everything I built |
| `posts/`   | writing |
| `papers/`  | publications, with BibTeX |
| `videos/`  | optional extras attached to YouTube videos, keyed by video id |

If the build no longer works and you only want to fix a typo, **edit the HTML in
`docs/` directly**. It is plain, readable HTML. That is a legitimate way to
maintain this site and it will keep working long after the toolchain does not.

## Things that are deliberately absent

No analytics. No comment system. No CDN. No web fonts loaded from someone
else's server. No tracking of any kind.

Every one of those would be a company that has to stay in business for this page
to keep rendering correctly. Fonts, styles, scripts and images are all served
from this repository.

If you are tempted to add something, ask whether the site still works in twenty
years if that thing disappears.

## The one exception: the contact form

There is no e-mail address anywhere on this site, by choice. That leaves the
contact form as the only way through, and a form needs a server, which a static
site does not have. So `/contact` POSTs to a third-party form service, set as
`CONTACT_ENDPOINT` in `src/consts.ts` — currently Web3Forms, which also needs
`CONTACT_ACCESS_KEY` in the same file. That key is public by design and has to
ship in the HTML, but it is provider-specific: changing provider means clearing
it too.

This is the single dependency on somebody else staying in business. It is a
deliberate trade and it is worth knowing how it fails:

- If the service dies, the form silently stops delivering. **Nothing on the page
  will look broken.** That is the dangerous failure, so if this site matters to
  you, send yourself a test message once in a while.
- With `CONTACT_ENDPOINT` empty, the page says plainly that it is not connected
  instead of rendering a form that swallows messages. Keep that behaviour.

To remove the dependency entirely, delete `src/components/ContactForm.astro`
and put a plain address back on `/contact`. A `mailto:` link outlives every
form service ever built. The only reason it is not the default here is that a
published address gets scraped.

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

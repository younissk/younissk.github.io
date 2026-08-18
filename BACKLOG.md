# Backlog — youniss.dev subdomains & tools

Each item is issue-shaped: **what**, **why**, **done when**, plus effort and blockers.
IDs are stable — keep them if these become GitHub issues.

Legend — effort: `S` ≤ half a day · `M` 1–2 days · `L` 3+ days
Cost = marginal cost per visitor. `$0` means static / client-side only.

---

## T-01 — Look into a Tython playground

**Repo:** [younissk/tython](https://github.com/younissk/tython) (public, Python) · **Effort:** L · **Cost:** $0 if client-side

**Why:** Tython is the strongest traffic hook in the whole portfolio — a statically-typed
language designed so *humans and LLMs* both parse code better. That's a topic people
actively search. A language without a playground is a README; a language with one is a
thing people share.

**Open question to settle first:** how does Tython run in a browser?
- (a) transpile to JS client-side → best outcome, $0 forever, no server
- (b) Pyodide / WASM build of the existing Python toolchain → heavy first load (~10MB), still $0
- (c) server-side eval → **reject**, that's an arbitrary-code-execution surface and a bill

**Done when:** a visitor can type Tython in the browser, hit Run, and see output —
with no request leaving the page. Ships with 5–6 preloaded examples.

**Note:** if it ends up built inside this repo, it belongs at `youniss.dev/tools/tython`
(a real path consolidates SEO). A subdomain only makes sense if it becomes its own deploy.

---

## T-02 — Point Tython docs at `tython.youniss.dev`

**Repo:** younissk/tython · **Effort:** S · **Blocks:** nothing · **Depends on:** nothing

Currently at `younissk.github.io/tython/` where nothing links to it.

**Done when:**
1. Netlify DNS: `CNAME tython.youniss.dev → younissk.github.io`
2. `echo "tython.youniss.dev" > CNAME` committed to the repo root
3. GitHub repo → Settings → Pages → Custom domain set, **Enforce HTTPS** ticked
4. Entry added to `youniss.dev/tools`

Do this one first — it's 15 minutes and unblocks nothing else.

---

## T-03 — Small demo for `quran-word-by-word.youniss.dev`

**Repo:** [younissk/quran-word-by-word-translation](https://github.com/younissk/quran-word-by-word-translation) (public) · **Effort:** M · **Cost:** $0

**Why:** by a wide margin the largest natural audience of anything here. Free, permissively
licensed, explicitly sadaqah. Static JSON + a client-side viewer costs nothing per user
and never goes down.

**Done when:** pick a surah, see Arabic word-by-word with the English equivalent under each
token. Search across words. Fully static, no backend, works offline after first load.

**Must ship with the disclaimer visible, not buried.** The README says the lexicon is
in progress and **has not been reviewed by a qualified scholar**. That has to sit above the
fold on the demo, in the same type size as the content — not in a footer, not in a `<details>`.
This is the one item where getting the honesty framing right matters more than the UI.

**Naming:** `quran.youniss.dev` is shorter and easier to say aloud. Consider it.
Longer term this deserves its own domain — the audience won't care about the portfolio.

---

## T-04 — Demo + nicer page for TempBench

**Repo:** [younissk/TempBench-Temporal-LALM-Reasoning-benchmark](https://github.com/younissk/TempBench-Temporal-LALM-Reasoning-benchmark) (public) · **Effort:** M · **Cost:** $0

**Why:** benchmarks get **cited and linked by researchers** — the highest-quality inbound
links available, and the ones search engines weigh most. The finding is sharp and quotable:
LALMs are near chance on trivially easy temporal audio tasks.

**Done when:**
- a results **leaderboard table** (model × task family), sortable, with the chance baseline drawn in
- the 7 temporal task families explained in one paragraph each, with a playable audio sample per family
- methodology + how to submit a model
- a citable BibTeX block
- live at `tempbench.youniss.dev` (same GH Pages + CNAME recipe as T-02)

The "here's the audio, now you try" interaction is what makes this shareable rather than
just readable.

---

## T-05 — Clean up jku-exam-practice → `jku-exams.youniss.dev`

**Repo:** [younissk/jku-exam-practice](https://github.com/younissk/jku-exam-practice) (public) · **Live:** https://jku-exam-simulator.netlify.app · **Effort:** M

**Why:** highest **repeat-visit rate** of anything owned here. A captive, recurring audience
(JKU students, every exam period) that comes back without any marketing. Nothing else in the
portfolio has that property.

**Cleanup scope:** mobile pass (students use phones), clear "which exam / which course"
navigation, obvious contribution path since it's open source now, and an honest note about
who maintains it and how current the question set is.

**Done when:** live at `jku-exams.youniss.dev`, works on a 375px screen, and a new student
can find their course in under 10 seconds.

---

## T-06 — Privacy Journal: polish, Capacitor build, → `privacy-journal.youniss.dev`

**Repos:** [privacy-journal-web](https://github.com/younissk/privacy-journal-web) (public, live), [privacy-journal](https://github.com/younissk/privacy-journal) · **Effort:** L

**Why:** the strongest *product* story here — entries live in the user's **own GitHub repo**,
so the app never holds the data. That's a real differentiator, not a marketing line.

**Three separate pieces:**
1. **Polish the web app** — onboarding is the whole battle. "Connect your GitHub repo" has to
   be explained before it's asked for.
2. **⚠️ Check the Whisper integration before going public.** If voice-to-text calls an API key
   you own, every stranger who uses it spends your money, and there's no rate limit between
   them and your bill. Make it bring-your-own-key, or gate it, or cut it. **Do this check
   before the DNS change, not after.**
3. **Capacitor bundle** — wrap the existing web app rather than maintaining the separate
   React Native codebase. Note the old native attempt was abandoned over App Store fees;
   nothing about Capacitor changes that, so decide whether the mobile build actually ships
   to a store or just installs as a PWA.

**Done when:** web version at `privacy-journal.youniss.dev` with no API key of yours exposed,
and a documented decision on the mobile path.

---

## T-07 — Point nanoBeard page at `nanobeard.youniss.dev`

**Repo:** [younissk/nanoBeard](https://github.com/younissk/nanoBeard) (public) · **Effort:** S

Tiny GPT trained from scratch on piratized TinyStories, then SFT-tuned. Good story, and
"I trained a language model from nothing" is a credential that reads instantly.

**Done when:** GH Pages + CNAME recipe from T-02, plus a `/tools` entry linking to both the
page and the [HF model card](https://huggingface.co/younissk/DISCO-v0.1).

**Do not host inference.** A live demo means a GPU bill that scales with strangers. Static
writeup + a link to Hugging Face, which already hosts it for free.

---

## T-08 — Publish Jeopardy through youniss.dev (with the IP problem fixed)

**Repo:** `/Users/youniss/Documents/GitHub/jeopardy` — **local only, no git remote** · **Effort:** L · **Cost: NOT $0**

Realtime family game: host drives the board, players buzz in from their phones.
Express + socket.io + React, currently exposed for play via a Cloudflare tunnel.

**This is the only item on the list with real ongoing cost and real legal work.** Both need
deciding before any hosting work starts.

### The IP problem — it's trademark, not copyright
*Jeopardy!* is a registered trademark of Jeopardy Productions, Inc. The clue content you
wrote is yours; the **name, the logo, the blue board, the categories-over-dollar-values
layout, the typeface, and the think-music** are not. A public site called "Jeopardy" is a
takedown waiting to happen — a private family game night is not.

**Fix:** rename it (something of your own), restyle the board so it isn't a visual copy,
ship only clues you wrote, and don't use the theme music. Then it's your game.

### The hosting problem
Socket.io holds live per-room state, so this **cannot be static**. Options:
- small always-on host (Fly.io / Railway / Render) — simplest, real monthly cost
- Cloudflare Durable Objects — one object per room, scales to zero, cheapest at low traffic,
  but the server needs rewriting
- keep it self-hosted behind the tunnel and publish only the *code* + a "run it yourself"
  guide — **$0, zero abuse surface, and honestly the best cost/benefit**

Also needs: room-code collisions, rate limiting, and a room TTL before strangers touch it.

**Done when:** the name/branding no longer reference the TV show, the repo has a remote, and
a decision is written down on which hosting option (including "self-host only") is being taken.

**First step is just:** `gh repo create` and push it, so it stops existing in one place.

---

## T-09 — Point gaussian-elimination-game at youniss.dev

**Repo:** [younissk/gaussian-elimination-game](https://github.com/younissk/gaussian-elimination-game) (public, TypeScript/Vite) · **Effort:** S · **Cost:** $0

Client-side only, no server, no state — the ideal shape for a free tool. Teaching row
reduction as a game has a genuine evergreen audience (every linear algebra course, every year).

**Done when:** built and deployed, reachable from `youniss.dev`, listed on `/tools`.

**Path vs subdomain:** this one is small and self-contained, so `youniss.dev/tools/gaussian-elimination`
is the better call — it keeps the SEO on the main domain. Subdomain only if it grows.

**Also:** the README is still the stock Vite template. Replace it — it's a public repo and
that README is currently the first thing anyone sees.

---

## Suggested order

Cheap wins first, so the `/tools` page has something real on it within a day:

| | item | effort |
|---|---|---|
| 1 | **T-02** tython docs → subdomain | S |
| 2 | **T-07** nanoBeard → subdomain | S |
| 3 | **T-09** gaussian elimination → deploy | S |
| 4 | **T-05** jku-exams cleanup + subdomain | M |
| 5 | **T-04** TempBench leaderboard | M |
| 6 | **T-03** Quran word-by-word demo | M |
| 7 | **T-06** privacy journal (⚠️ do the API-key check first) | L |
| 8 | **T-01** tython playground | L |
| 9 | **T-08** jeopardy — rename, then decide hosting | L |

---

## Standing rules for anything on this list

- **A dead tool link is worse than no tool link.** Nothing goes on `/tools` until its URL
  returns 2xx.
- **No tool ships with an API key of yours in the request path.** Marginal cost per stranger
  must be zero, or explicitly budgeted.
- **Every subdomain gets a link back to `youniss.dev`** in its header. That link is the
  entire funnel; without it the tool is just a tool.

---

# Features

Bigger than the T-items above. These are things the site does not do yet, not
chores. Ordered by how much they would change the impression the site makes.

Legend — effort: `S` ≤ half a day · `M` 1–2 days · `L` 3+ days

---

## F-01 — Run nanoBeard in the visitor's browser

**Effort:** M · **Cost:** $0 per visitor · **Status:** not started

**Why:** the single most differentiated thing available here. A stranger opens
`/projects/nanobeard/` and talks to a language model trained from scratch,
running on their own machine, in about ten seconds. Not a video of a demo, not
a repo to clone — the artifact, executing.

It also fits the site's whole architecture: static, client-side, no server, no
API key, no bill, works offline after first load, and it outlives everything
the same way the rest of the site does.

**Feasible because the models are small enough** — checked against the real
files on Hugging Face:

    sloop-14M.Q4_K_M.gguf      11.6 MB   ← smaller than most hero images
    galleon-34M.Q4_K_M.gguf    24.8 MB
    frigate-125M.Q4_K_M.gguf   79.2 MB

**Approach:** `wllama` (llama.cpp compiled to WASM) loads a GGUF client-side.
Ship `sloop-14M` Q4 as the default, offer galleon as a heavier option, do not
offer frigate — 79 MB is too much to pull without asking.

**Done when:** a load-on-click button (never auto-download 12 MB), a visible
progress bar, a chat box, an honest note that a 14M-parameter model is a toy
and will say ridiculous things, and a link to the training repo. Must degrade
to a plain link on browsers without the required WASM features.

---

## F-02 — Semantic search over the site's own content

**Effort:** M · **Cost:** $0 · **Status:** not started

**Why:** the site's search is string matching, from someone whose job is
retrieval. Embed every page at build time with `transformers.js` + MiniLM,
commit the vectors as JSON, run cosine similarity in the browser. Someone types
"how do you test agents" and finds the LLM QA work without those words being in
it.

The point is not better search. It is that the site demonstrates the skill
being hired for, on itself, and a technical reader notices within one query.

**Done when:** it is wired into the ⌘K palette as a second ranked group under
the literal matches, not as a separate box. Vectors committed, nothing fetched
at runtime, graceful fallback to the existing Fuse matching.

---

## F-03 — Make TempBench playable

**Effort:** M · **Cost:** $0 · **Status:** not started · **Related:** T-04

**Why:** there is a benchmark whose finding is "audio-language models fail at
trivially easy temporal questions", and right now that finding is a README.

Put the audio on the page. The visitor hears two tones, answers "which came
first", *then* sees that the models scored near chance on the same item. That
converts a benchmark into an experience people share, and benchmark pages get
cited — the highest-quality inbound links available.

**Done when:** one playable item per task family, a real leaderboard with the
chance baseline drawn in, methodology, and a citable BibTeX block.

---

## F-04 — Index the video transcripts

**Effort:** M · **Blocked on:** `YT_API_KEY` + `YT_CHANNEL_ID`

**Why:** YouTube keeps all the search traffic from the videos. Pulling
transcripts and rendering them as text on this domain means the words become
findable here too, and each video page stops being a thumbnail and a title.

**Done when:** transcripts fetched during the existing nightly sync, stored
alongside `videos.json`, rendered on the video page, and included in the ⌘K
index.

---

## F-05 — A three.js piece that shows something true

**Effort:** M · **Status:** not started

**Why not decoration:** the old site had a p5.js particle hero and it was
deliberately deleted. Another animated backdrop would be a step backwards, and
the design rules forbid it.

**Why it could still earn a place:** the thesis is literally about rendering
embeddings as images. There is a public dataset for it,
`younissk/audio-text-embed-to-images`. A 3D explorer of that embedding space —
audio and text points, hover to hear the clip and read the caption, watch the
matched pairs pull together — is a **figure for a real paper**, not a flourish.
It is also the only interactive thing that explains the thesis better than the
PDF does.

**Cost to be honest about:** three.js is ~600 KB gzipped on a site that
currently ships almost no JavaScript. It must be self-hosted (no CDN) and
loaded only on the page that needs it, `client:visible`, behind a click.

**Done when:** it lives on the thesis paper page or the Embed2Image project
page, never the home page, and the rest of the site is byte-for-byte unaffected.

---

## F-06 — Ask-my-site chatbot

**Status: rejected, deliberately.** Recorded here so it does not get proposed
again.

It needs an API key, which means a bill that scales with strangers and a server
this site does not have — breaking both stated constraints. Built client-side
with a small model instead, it would be bad, and a bad chatbot is worse than
none. Every third AI portfolio has one.

**F-01 is this idea done properly**: not a wrapper around someone else's API,
but the author's own model, running on the visitor's machine.

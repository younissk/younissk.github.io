---
title: Luraty Engine
repoName: luraty-engine
summary: Runtime-agnostic TypeScript core for an adaptive language trainer — learner state, scheduling and language packs, no framework deps.
year: 2026
period: "2026"
category: tooling
tags: [spaced-repetition, language-learning, typescript, library]
stack: [TypeScript, Vitest, Changesets, Hermes]
status: active
repo: null
demo: null
paper: null
private: true
featured: true
---

The decision layer behind Luraty, an adaptive trainer aimed at heritage speakers — people who
grew up hearing a language and understand far more than they can produce. The engine holds
everything that matters: what to teach next, when, how an answer is judged, and what the answer
changes. It runs unchanged under Hermes (React Native), Node and a browser, with no framework
imports, so a mobile app is only ever a frontend.

Five slices are in: learner state and the evidence fold that records answers, serialize/deserialize
persistence, language packs behind a four-function contract, coverage, and the scheduler. Placement
is modelled as *claims* — a learner asserts she knows 400 words and nobody has checked yet — so
day one is never an empty screen, and every planned item carries a reason (`verify`, `new`,
`relearn`, `review`) that the UI is expected to present differently.

Technically the interesting parts are the type-level guards (`day(0)` is a compile error because 0
means "never" internally), the pack contract deliberately kept narrow enough that unsupported
features show up as missing *inputs* rather than missing ideas, and cross-runtime benchmark and
stress lanes that keep the hot path allocation-free under Hermes.

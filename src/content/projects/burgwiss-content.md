---
title: Burgwiss content pipeline
repoName: burgwiss-content
summary: Content-engineering system for a training school — course material in Markdown, built to PDF via Pandoc, gated by automated pedagogy checks.
year: 2026
period: "2026"
category: teaching
tags: [content-pipeline, pedagogy, pandoc, authoring-tools]
stack: [TypeScript, Electron, Markdown, Pandoc, LaTeX, Make]
status: active
repo: null
demo: null
paper: null
private: true
featured: false
---
Course material treated the way a good team treats source code: one source of truth, a build pipeline, and a review gate. Notes are captured raw, promoted into structured sources and curriculum, written up as Markdown lessons, then rendered to teaching PDFs through Pandoc and a LaTeX template.

The review gate is the point. Explicit pedagogy principles live in the repo, and agent skills (`review-lesson`, `check-structure`, `check-readability`, `check-pedagogy`, `plan-course`) check drafts against them. It is deliberately not a content generator — the author owns the voice, the system enforces consistency and removes the rendering and structuring busywork. An Electron app sits on top for authoring.

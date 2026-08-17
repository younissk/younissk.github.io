---
title: Sunnah Search
repoName: SunnahSearch
summary: Search over Islamic audio and text sources, with a Python ETL feeding a Next.js front end and a roadmap toward hybrid search.
year: 2025
period: "2025"
category: web
tags: [search, embeddings, etl, arabic]
stack: [Next.js, TypeScript, Python, PostgreSQL, Netlify]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

A Python ETL layer pulls audio metadata into a `search_items` table that the Next.js app queries. The roadmap in the repo is explicit about where it was heading: full-text search via generated `search_tsv` columns and triggers, an embedding generation pipeline for transcripts, fuzzy matching, and then a hybrid ranking combining all three — plus bookmarks, collections and recommendations driven by what you are currently listening to.

Two smaller siblings sit around it: `sunnah-search`, a single-file right-to-left Arabic search UI used as a visual prototype, and `SunnahSoundsApp`, an Expo shell that never got past scaffolding.

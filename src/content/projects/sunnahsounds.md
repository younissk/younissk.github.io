---
title: SunnahSounds
repoName: SunnahSounds
summary: Next.js catalogue of Islamic audio lectures with authenticated collections, author and organisation pages, and embedding-based search.
year: 2025
period: "2025"
category: web
tags: [audio, search, embeddings, nextjs]
stack: [TypeScript, Next.js, Tailwind CSS, Python, Jupyter]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

An audio library app: browse and play lectures, group them into collections, and navigate by author or by the organisation that published them, with auth-gated dashboard routes behind Next.js middleware.

The search side is backed by an embedding-generation notebook that indexes the catalogue, and ingestion is prototyped against SoundCloud — so the repository holds both the product surface and the data pipeline that fills it.

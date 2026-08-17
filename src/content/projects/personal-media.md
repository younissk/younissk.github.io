---
title: Personal Media Feed
repoName: PersonalMedia
summary: Local-first feed tracking YouTube and SoundCloud sources, downloading audio and ranking unplayed items by similarity.
year: 2026
period: "2026"
category: web
tags: [recommendations, embeddings, self-hosted, media]
stack: [Python, HTML, yt-dlp, scdl, ffmpeg]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

A self-hosted alternative to an algorithmic feed: you add the channels and profiles yourself (manually or by CSV), the app ingests their uploads, and it ranks the unplayed ones for you. There is an embedded overlay player, per-item "similar content" using local cosine-similarity embeddings, and a "See More Of This" control that boosts a source in the ranking.

Everything runs locally — audio download goes through `yt-dlp` with an `scdl` fallback for SoundCloud, search only looks at sources you already saved, and no external lookup happens.

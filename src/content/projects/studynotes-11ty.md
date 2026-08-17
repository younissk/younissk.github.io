---
title: Study notes
repoName: studynotes_11ty
summary: Static site collecting university lecture notes, rebuilt on Eleventy with a Netlify CMS admin for editing entries in the browser.
year: 2023
period: "2021–2023"
category: web
tags: [eleventy, netlify-cms, notes, static-site]
stack: [Eleventy, Nunjucks, Netlify CMS, CSS]
status: archived
repo: null
demo: null
paper: null
private: true
featured: false
---
A public collection of lecture notes, kept mostly as a motivation device for studying. This is the second version: Eleventy generating a per-note page tree, with a Netlify CMS admin mounted at `/admin` so notes could be written and published without touching the repo.

The first version (`studynotes`) was Svelte plus Firebase hosting, published at study.youniss.info, with notes authored in StackEdit and dropped in as HTML — the rebuild traded that for a git-backed content model.

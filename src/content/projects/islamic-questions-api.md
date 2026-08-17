---
title: Islamic Questions API
repoName: islamic-questions-api
summary: Tiny read-only REST API serving a curated question set, deployed serverless on Vercel.
year: 2024
period: "2024"
category: web
tags: [rest-api, serverless, python]
stack: [Python, FastAPI, Vercel]
status: shipped
repo: null
demo: https://islamic-questions-rest-api.vercel.app
paper: null
private: true
featured: false
---

A deliberately minimal API: a JSON question file, a single Python entrypoint serving it over HTTP, and a `vercel.json` that puts it on a public URL. Small enough to read in one sitting, which was the point — a working deployment path for a static dataset without standing up any infrastructure.

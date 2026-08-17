---
title: PaperNavigator
repoName: PaperNavigator
summary: Academic paper discovery tool that profiles a research question, snowballs through citations, filters with an LLM and generates a report.
year: 2026
period: "2026"
category: ai-ml
tags: [llm, literature-search, snowball-sampling, azure, serverless]
stack: [Python, Azure Functions, Bicep, TypeScript, React, OpenAI]
status: shipped
repo: https://github.com/younissk/PaperNavigator
demo: https://papernavigator.com
paper: null
private: false
featured: true
tool:
  tagline: Give it a research question; it snowballs outward through citations, filters the harvest with an LLM and writes you a report.
  url: "https://papernavigator.com"
  internal: false
  status: "live"
video: null
post: null
---

A research question goes in; the pipeline turns it into a structured query profile, augments it into several search queries for coverage, then snowball-samples outward from seed papers through citations and references. An LLM filtering pass scores the harvested papers for relevance before ranking and report generation.

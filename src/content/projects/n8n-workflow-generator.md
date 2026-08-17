---
title: n8n Workflow Generator
repoName: n8n-workflow-generator
summary: Chat server that generates runnable n8n automation workflows from natural language, grounded in a corpus of per-node example workflows.
year: 2025
period: "2025"
category: ai-ml
tags: [llm, code-generation, automation, n8n]
stack: [Python, uv]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

The interesting asset here is not the model call but the corpus: several hundred example n8n workflows organised by integration node — Airtable, AWS S3, Asana, Bitwarden, ClickUp, Slack and on down the list — used as grounding so generated workflow JSON references real node types with real parameter shapes rather than plausible-looking inventions.

A small Python chat server with HTML templates sits on top, turning a description of an automation into a workflow definition that can be pasted straight into n8n.

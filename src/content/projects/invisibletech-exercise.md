---
title: PII Redact
repoName: invisibletech_exercise
summary: Two-phase PII detection and redaction pipeline combining regex with LLM detection, driven by an interactive terminal wizard.
year: 2026
period: "2026"
category: ai-ml
tags: [pii, privacy, llm, cli, evaluation]
stack: [Python, OpenAI, Google Gemini, Rich, Hypothesis, uv]
status: shipped
repo: null
demo: null
paper: null
private: true
featured: false
---

Built as a take-home exercise. Text goes through a fast regex pass first, then an LLM pass (OpenAI or Gemini) picks up the entities regex cannot see, and matches are replaced with stable placeholders like `[PERSON_1]` and `[EMAIL_1]` so document structure survives redaction. Placeholder, mask and remove modes are all supported.

The parts worth noting are around the pipeline rather than in it: an evaluation harness with stored results, property-based tests via Hypothesis, and a loader for the Nemotron PII dataset to score detection against labelled data. The whole thing is fronted by a Rich-based interactive wizard reachable with a single `make run`.

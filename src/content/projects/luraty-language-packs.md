---
title: Luraty language packs
repoName: luraty-language-packs
summary: Reproducible pipeline turning public corpora into word-frequency lists and lemma tables for German and Arabic.
year: 2026
period: "2026"
category: data
tags: [nlp, corpora, frequency-lists, arabic, german]
stack: [Python, JavaScript, Make, Hugging Face]
status: active
repo: https://github.com/younissk/luraty-language-packs
demo: null
paper: null
private: false
featured: false
---

Builds frequency lists and inflection tables from Leipzig corpora and Wikidata Lexemes, and publishes them as datasets. It serves two audiences on purpose: anyone who just wants `frequency.txt` for a language, and the Luraty language app downstream, which consumes the same output as `@luraty/pack-*` packages.

The interesting part is the licence and provenance gate — a stdlib-only Python check that must pass before anything else runs, so no byte ships without a recorded source and licence. The repo is mid-migration from Node to Python, and the port was done by asserting byte-identical output against the Node original rather than by eyeballing a diff. The two halves talk through a file format (Leipzig's `rank <TAB> word <TAB> count`), not an API, so neither imports the other.

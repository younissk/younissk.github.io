---
title: Qur'an Word by Word
repoName: quran-word-by-word-translation
summary: Pipeline that builds an English word-by-word lexicon of the Qur'an by asking several LLMs the same question and keeping what they agree on.
year: 2026
period: "2026"
category: data
tags: [llm, dataset, arabic, consensus]
stack: [Python, JSONL, LLM APIs]
status: active
repo: null
demo: null
paper: null
private: true
featured: false
---

A free word-by-word English lexicon of the Qur'an: for every Arabic word, one short equivalent
appropriate to that word in that verse, with lemma and position. It is explicitly not a translation
and not a substitute for one — reading glosses in sequence gives the shape of a verse, never its
meaning.

The method is the point. Several independent language models are asked the same narrowly factual
question, and only the answers they agree on are kept; disagreements are written out to a separate
`disputed.jsonl` rather than silently resolved. The repository carries a methodology document, a
provenance file and a dataset card, and is careful about derivation: no third-party translation is
copied into the output, and the honesty section states plainly that no qualified scholar has
reviewed the result yet.

Python package with a CLI, pluggable providers, guard checks on generated rows, and an overnight
batch script; German output is produced alongside English.

---
title: Tool Calling SFT Mix
repoName: tool-calling-mix
summary: Supervised fine-tuning dataset for tool use, unifying several public tool-calling corpora plus deliberate no-call examples under one schema.
year: 2025
period: "2025"
category: data
tags: [dataset, tool-calling, fine-tuning, huggingface]
stack: [Python, Hugging Face Datasets, uv]
status: shipped
repo: https://github.com/younissk/tool-calling-mix
demo: https://huggingface.co/datasets/younissk/tool-calling-mix
paper: null
private: false
featured: true
---

A published Hugging Face dataset that merges ToolBench, xLAM60k, OpenFunctions v1 and others into a single schema (`tools_json`, `messages_json`, `target_json`, `meta_source`, `n_calls`), then deliberately mixes in non-tool instruction and plain-text examples from Dolly and WikiText to guard against catastrophic forgetting of general language ability during tool-use fine-tuning.

The repository is the build pipeline, not just the output: per-source loaders, parsers that normalise wildly different call formats, a synthetic generator for parallel-call scenarios from scenario templates, a quality-control and validation pass, and visualisation of the resulting distribution. Splits are seeded for reproducibility, and the README documents known limitations — source bias, limited tool-domain diversity — rather than only the headline numbers.

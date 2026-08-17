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
featured: false
tool:
  tagline: A fine-tuning dataset for tool use that unifies several public corpora under one schema and deliberately mixes in examples that should not call anything.
  url: "https://huggingface.co/datasets/younissk/tool-calling-mix"
  internal: false
  status: "live"
video: null
post: null
---

A published Hugging Face dataset that merges ToolBench, xLAM60k, OpenFunctions v1 and others into a single schema (`tools_json`, `messages_json`, `target_json`, `meta_source`, `n_calls`), then mixes in non-tool instruction and plain-text examples from Dolly and WikiText to guard against catastrophic forgetting of general language ability during tool-use fine-tuning.

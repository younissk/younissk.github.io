---
title: Falcon-Twig
repoName: falcon-twig
summary: Fine-tuning run for Falcon H1 7B on tool calling that underperformed the base instruct model, written up as a technical report.
year: 2025
period: "2025"
category: ai-ml
tags: [llm, fine-tuning, tool-calling, negative-result]
stack: [Python, PyTorch, Transformers, Makefile]
status: shipped
repo: https://github.com/younissk/falcon-twig
demo: null
paper: /papers/Falcon_Twig_Technical_Report.pdf
private: false
featured: true
---

I was really interested in how people used tools from OpenAI in the past and how LLMs have evolved. I wanted to explore how I could use tools to enhance the performance of LLMs, so I fine-tuned the Falcon H1 model to use tools.

A fine-tune of Falcon H1 7B aimed at tool calling, reduced to a single `make train`. The honest
result is that it lost to the plain instruct model on the very task it was tuned for, which makes it
useless in production and useful as a write-up — the technical report covers what went wrong rather
than claiming a win.

The repo is set up for reproducibility on rented hardware: TOML run configs, a bootstrap script and
a "fastpath doctor" that checks the machine before a run, and the data, modelling and training code
kept in separate modules under a typed Python project.

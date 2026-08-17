---
title: nanoBeard
repoName: nanoBeard
summary: A small pirate-themed GPT trained from scratch on a piratized TinyStories corpus and then SFT-tuned, with a versioned training codebase.
year: 2026
period: "2026"
category: ai-ml
tags: [llm, pretraining, sft, pytorch, tokenizer]
stack: [Python, PyTorch, Hugging Face, Gradio, MkDocs]
status: shipped
repo: https://github.com/younissk/nanoBeard
demo: https://younissk.github.io/nanoBeard/
paper: null
private: false
featured: true
---

A from-scratch language model trained on a piratized version of TinyStories, then supervised
fine-tuned — closer to nanoGPT than to a production LM, and honest about it. The first ship-class,
Sloop, is published on Hugging Face; later classes (Brig, Frigate, Galleon) are configs in the same
codebase.

The repo is structured so multiple model versions live under one training pipeline: architectures
are one file each behind a model registry, datasets are composed from reusable piratized corpora
via recipe files that record the tokenizer and metadata, and each version gets its own run
directory and eval report. There is a perplexity and sample-gallery eval harness, a Gradio
playground with a version dropdown, an MkDocs site, and a pytest suite over the pipeline.

This is the most-used thing in the index by some distance — it picked up a meaningful number of
stars and forks from people wanting a small end-to-end training repo to read.

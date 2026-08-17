---
title: Embed2Image contrastive retrieval
repoName: embed2image-contrastive-retrieval
summary: Audio-text retrieval experiments on Clotho comparing a PaSST+RoBERTa baseline against a pseudo-image ViT encoder head.
year: 2025
period: "2025"
category: ai-ml
tags: [contrastive-learning, audio-text, retrieval, dcase]
stack: [Python, PyTorch Lightning, PaSST, RoBERTa, Weights & Biases]
status: experiment
repo: https://github.com/younissk/embed2image-contrastive-retrieval
demo: null
paper: /papers/Filomeno_JKU_task6_1.technical_report.pdf
private: false
featured: true
---

As part of a course, I participated in the DCASE 2025 Challenge with a small team. We tried many different approaches and were able to work on the Vienna Scientific Computing cluster. While we didn't win, we got a lot of experience with audio ML, and our technical report was published on the DCASE website.

Training is a Lightning module mirroring the DCASE Task 6 baseline — a PaSST audio encoder and a RoBERTa text encoder with learned projection heads — trained contrastively on Clotho v2.1. The variant the repo is actually named after swaps in a vision head: the audio embedding is turned into a pseudo-image and run through a ViT.

Everything is driven from a Makefile: `make prepare` handles the uv environment and dataset download, `make train-baseline` and `make train-vision` launch the two configurations with their default hyperparameters, and the newest checkpoint is evaluated automatically when a run finishes. W&B logging is on by default, so the two heads are directly comparable run-to-run.

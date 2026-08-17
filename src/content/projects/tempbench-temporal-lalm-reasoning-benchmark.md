---
title: TempBench — temporal reasoning in audio language models
repoName: TempBench-Temporal-LALM-Reasoning-benchmark
summary: Benchmark of seven synthetic task families testing whether audio-language models handle trivial questions about event order and timing.
year: 2026
period: "2025–2026"
category: research
tags: [benchmark, audio, evaluation, llm, synthetic-data]
stack: [Python, PyTorch, SLURM, Weights & Biases, Make]
status: active
private: false
featured: true
links:
  - { kind: site, label: "Open it", url: "https://younissk.github.io/TempBench-Temporal-LALM-Reasoning-benchmark/" }
  - { kind: paper, label: "Paper", url: "/papers/dcase-2025-language-based-audio-retrieval/" }
  - { kind: repo, label: "Code", url: "https://github.com/younissk/TempBench-Temporal-LALM-Reasoning-benchmark" }
---

Each task isolates exactly one temporal property and makes the separation large, so the temporal signal is the only thing a model could be using: which of two beeps came first by pitch, by loudness, by duration; how many beeps; short pause or long pause; high-low-high or low-high-low; dog bark before car horn or after. Every dataset is generated from code at `difficulty=easy`, and the repo also ships a non-temporal safety suite purely as an end-to-end sanity check that the harness runs.

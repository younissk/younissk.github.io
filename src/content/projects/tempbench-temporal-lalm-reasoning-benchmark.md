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
repo: https://github.com/younissk/TempBench-Temporal-LALM-Reasoning-benchmark
demo: https://younissk.github.io/TempBench-Temporal-LALM-Reasoning-benchmark/
paper: null
private: false
featured: true
---

Each task isolates exactly one temporal property and makes the separation deliberately large, so the temporal signal is the only thing a model could be using: which of two beeps came first by pitch, by loudness, by duration; how many beeps; short pause or long pause; high-low-high or low-high-low; dog bark before car horn or after. Every dataset is generated from code at `difficulty=easy`, and the repo also ships a non-temporal safety suite purely as an end-to-end sanity check that the harness runs.

The runner supports several evaluators — a random baseline, a text-only Qwen, Qwen2-Audio and Audio Flamingo — with a SLURM sweep for the full suite. The repo's own reported conclusion from its runs is that performance sits near chance on tasks designed to be trivial; the framing of the whole benchmark is that the failure should be easy to reproduce rather than argued about.

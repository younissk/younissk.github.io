---
title: MLPC Audio Classification
repoName: MLPC
summary: Course project on an annotated audio dataset — temporal annotations, precomputed MFCC and ZCR features, and text embeddings for titles and keywords.
year: 2025
period: "2025"
category: ai-ml
tags: [audio, classification, feature-engineering, embeddings]
stack: [Python, NumPy, pandas, librosa, Jupyter]
status: archived
repo: https://github.com/younissk/MLPC
demo: null
paper: null
private: false
featured: false
---

Work on the MLPC2025 dataset: mp3 recordings with per-region temporal annotations, aligned metadata, and precomputed frame-level audio features (MFCC, zero-crossing rate and others) alongside text embeddings for titles, keywords and annotation descriptions.

The analysis lives in a single large notebook working over those aligned index-matched arrays — the practical challenge being to keep metadata rows, embedding matrices and per-file feature archives in lockstep while exploring the space.

---
title: Music recommender challenge
repoName: mrs-challenge
summary: Recommender system for LastFM listening data — random, popularity and ItemKNN baselines against matrix factorization, scored by nDCG.
year: 2025
period: "2025"
category: ai-ml
tags: [recommender-systems, matrix-factorization, itemknn, ndcg]
stack: [Python, NumPy, pandas, pytest, Jupyter]
status: shipped
repo: null
demo: null
paper: null
private: true
featured: false
---
An entry for the Music Recommender Systems challenge in a Learning from User-generated Data course, working on the LFM2B dataset of user–item listening events with precomputed musicnn item features.

The code is laid out as a small library rather than a notebook dump: a data loader, a `baselines/` package (random, popularity, ItemKNN), a matrix factorization model, an nDCG evaluation module and a CLI runner, with pytest around it. Each approach writes a recommendations TSV so runs are directly comparable.

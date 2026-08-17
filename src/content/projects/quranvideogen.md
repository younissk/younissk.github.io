---
title: QuranVideoGen
repoName: QuranVideoGen
summary: Notebook pipeline that renders recitation videos by aligning audio to verse text and burning in translations.
year: 2024
period: "2024"
category: tooling
tags: [video-generation, audio, automation, arabic]
stack: [Python, Jupyter, MoviePy]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

Generates short recitation videos from source data: a verse-indexed JSON corpus, reciter audio, and a translation file merged by `addTranslation.py`, with one notebook driving the video render and another going the other direction to extract structured JSON from existing videos. A single rendered ayah video is committed as the reference output.

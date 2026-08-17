---
title: AI Society
repoName: ai-society
summary: Generates a synthetic US population, turns each person into an LLM persona with a pixel-art sprite, and browses them in a web atlas.
year: 2026
period: "2026"
category: ai-ml
tags: [llm, agents, simulation, synthetic-data]
stack: [Python, Jupyter, TypeScript, LPC Spritesheet]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

A simulation experiment: sample a synthetic population from a society model of US demographics,
expand each sampled person into a full LLM-written persona, and render each persona as a pixel-art
character sheet generated from the Liberated Pixel Cup spritesheet generator.

The generation side is a set of Make targets over `uv`-managed Python — population, personas,
sprites — with distribution notebooks checking that the sampled population matches the society
template it came from. The frontend is a static "Population Atlas" that reads a synced index and
sprite folder, deployed via GitHub Pages, so the whole population can be scrolled through as
characters rather than rows.

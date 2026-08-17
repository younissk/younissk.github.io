---
title: ai-lab
repoName: ai-lab
summary: Python framework for building interactive ML playgrounds — subclass Playground, add sliders, plots and network visualisers, run.
year: 2026
period: "2026"
category: ai-ml
tags: [visualization, interactive, ml-education, gui]
stack: [Python, Dear PyGui, NumPy, mypy, MkDocs]
status: active
repo: null
demo: null
paper: null
private: true
featured: false
---
A component library for exploring ML concepts visually. You subclass `Playground`, place components (sliders, scatter plots, a drawing canvas, neural-network visualisers, LaTeX labels) at coordinates, and wire callbacks — the framework handles the Dear PyGui event loop and rendering.

It is structured as an engine package with its own event and renderer layers, a CLI launcher that discovers playgrounds automatically, pre-commit hooks, a mypyc compilation check, and CI that also publishes MkDocs to GitHub Pages.

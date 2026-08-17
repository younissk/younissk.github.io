---
title: Calisthenics Skill Tree
repoName: rl-skilltree
summary: React app that renders a calisthenics progression as an interactive network graph, with per-user progress kept in IndexedDB.
year: 2024
period: "2024"
category: web
tags: [visualization, graph, indexeddb, fitness]
stack: [TypeScript, React, Vite, IndexedDB]
status: experiment
repo: https://github.com/younissk/rl-skilltree
demo: null
paper: null
private: false
featured: false
---

Skill progressions in calisthenics are a dependency graph, not a list, so this renders them as one:
a JSON collection of skills is turned into nodes and edges by a generator and drawn as a network
graph you can click into. Unlocked state lives in IndexedDB, so there is no account and no server.

---
title: D&D Monopoly
repoName: dnd-monopoly-ai
summary: Browser board game crossing Monopoly with tabletop-RPG campaigns, using Firebase for game state and OpenAI in serverless functions.
year: 2025
period: "2025"
category: games
tags: [board-game, multiplayer, llm, pwa]
stack: [React, TypeScript, Vite, Mantine, Firebase, OpenAI API, Netlify Functions]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

The largest of the game experiments here: campaign setup, player preparation and selection, a round-by-round game view, profiles and a marketing surface, all as one Vite SPA. Game and campaign state live in Firebase behind Firestore rules, and the OpenAI calls run in Netlify functions so keys stay server-side.

It is also built as an installable PWA (there is a service worker registration path) and carries a Vitest setup with tests next to the game logic rather than only at the UI edge.

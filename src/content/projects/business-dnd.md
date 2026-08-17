---
title: Business D&D
repoName: business-dnd
summary: Local MCP server that turns Claude into the dungeon master of a multiplayer business-survival game with a seeded referee and persistent ledger.
year: 2026
period: "2026"
category: games
tags: [mcp, llm, game-design, simulation]
stack: [Python, MCP, uv]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

An MCP server that gives an LLM the things it cannot hold on its own while running a game: persistent state across restarts, an authoritative money ledger, and a seeded dice-and-event referee so outcomes are fair rather than narrated on a whim.

Players pick business archetypes with the same starting net worth but different engines — a restaurateur with a profitable bistro, an inheritor with a valuable money-losing workshop, an investor earning interest. Each round applies revenue minus cost automatically so idling bleeds you, a shared seeded market event hits everyone, and moves are committed privately before the DM resolves them together. Sector saturation thins margins by a `1/√competitors` factor, and negative cash starts a debt countdown with a grace period rather than eliminating you outright.

The whole thing is one `server.py` exposing the game as MCP tools (`new_game`, `roll_action`, `game_status`, `get_state`), which makes it a compact study in where the deterministic boundary between a model and a game engine should sit.

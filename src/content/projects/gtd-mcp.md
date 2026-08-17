---
title: GTD MCP
repoName: gtd-mcp
summary: Single-user GTD app on Cloudflare Workers and D1 that also exposes its task data to LLM agents over an MCP endpoint.
year: 2026
period: "2026"
category: tooling
tags: [mcp, gtd, productivity, edge, agents]
stack: [Cloudflare Workers, D1, Hono, React, Vite, TypeScript, Zod]
status: active
repo: null
demo: null
paper: null
private: true
featured: false
---

A personal Getting Things Done / Horizons tracker built Cloudflare-first: a Hono worker serving both the REST API and an MCP endpoint at `/mcp`, D1 for storage with SQL migrations, and a Vite React SPA on top.

The structural choice worth noting is the shared package — Zod schemas and the service layer live in `packages/shared` and are consumed by the HTTP API and the MCP surface alike, so an agent calling a tool and the UI calling an endpoint go through the same validation and the same business logic.

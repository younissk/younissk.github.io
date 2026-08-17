---
title: Falcon API
repoName: falcon-api
summary: LLM API gateway with issued API keys, Supabase-backed auth, chat and analytics routes, plus a demo SDK and a web console.
year: 2025
period: "2025"
category: ai-ml
tags: [llm-gateway, api-keys, fastapi, supabase]
stack: [Python, FastAPI, Supabase, TypeScript, LangChain, uv]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---
A self-hosted gateway in front of hosted models. The FastAPI backend splits into routers for auth, models, chat and analytics, with two credential paths: a Supabase bearer token for the console, and issued `ApiKey` credentials for programmatic access — created once and shown once, listable and revocable.

Alongside the service sits a `demo/` package with a hand-rolled `falcon_sdk` plus worked examples driving the same API through the OpenAI client, the LangChain client and raw requests, which doubles as a compatibility check on the gateway's surface. A frontend console covers key management and chat.

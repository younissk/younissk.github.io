---
title: Fullstack LLM project template
repoName: fullstack-llm-project-template
summary: Starter repo pairing a React/Vite frontend with a FastAPI backend doing RAG and tool calling against an OpenAI-compatible server.
year: 2025
period: "2025"
category: tooling
tags: [template, rag, tool-calling, fastapi, react]
stack: [TypeScript, React, Vite, Mantine, Clerk, Python, FastAPI, LangChain, ChromaDB]
status: shipped
repo: https://github.com/younissk/fullstack-llm-project-template
demo: null
paper: null
private: false
featured: false
---
Scaffolding to skip the first day of every LLM side project. The frontend is React + Vite with React Router, React Query, Mantine theming and Clerk auth; the backend is FastAPI managed with `uv`, using LangChain and ChromaDB for retrieval.

Tool calling is built as a registry with a `base` interface and concrete tools (calculator, document list, vector search) rather than hardcoded branches, so adding a tool is one file plus a registration. The LLM client points at any OpenAI-compatible endpoint, which in practice means a local `llama-server`.

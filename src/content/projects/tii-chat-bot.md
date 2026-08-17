---
title: Multi-Model LLM Serving Stack
repoName: tii-chat-bot
summary: Self-hosted chat stack running three vLLM model servers behind an OpenAI-compatible FastAPI gateway with Open WebUI on top.
year: 2025
period: "2025"
category: ai-ml
tags: [vllm, llm-serving, rag, openai-compatible, self-hosted]
stack: [Python, FastAPI, vLLM, ChromaDB, TypeScript, React, Docker]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

A full local LLM stack brought up by a single `make run-all`: three vLLM servers (TinyLlama, Qwen, Falcon) on consecutive ports, a FastAPI backend exposing OpenAI-compatible endpoints in front of them, and Open WebUI in Docker as the chat client.

Beyond serving, the backend carries a services layer with a Chroma vector store for retrieval, and there is a separate Vite/React admin frontend. The fiddly part is the orchestration rather than the models — readiness probing (`check_vllm_ready.sh`), a vendored vLLM source tree, and Makefile targets that let each layer be started and stopped independently.

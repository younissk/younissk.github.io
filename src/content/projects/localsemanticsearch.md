---
title: Local Semantic Search
repoName: LocalSemanticSearch
summary: Retrieval-only RAG over local PDFs — recursive indexing with OCR fallback, BGE embeddings, ChromaDB, and hybrid dense plus lexical search.
year: 2026
period: "2026"
category: ai-ml
tags: [rag, embeddings, vector-search, ocr, cli]
stack: [Python, ChromaDB, BAAI/bge-base-en-v1.5, Typer, Rich, Tesseract]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---
Everything runs on the machine: PDFs are indexed recursively, scanned or difficult pages fall back to Tesseract OCR, chunks are embedded with `BAAI/bge-base-en-v1.5` and persisted in a local ChromaDB.

Retrieval is deliberately not just cosine similarity — it combines dense and lexical scoring, chunks section-aware so snippets land on spans rather than arbitrary windows, and applies quality weighting and diversification on top. It ships as a Typer/Rich CLI and TUI plus a minimal Tk desktop window, installable as a global `lss` command that does not need `uv` at runtime, with health and benchmark subcommands for tuning the retrieval stack.

---
title: "Document AI and semantic search for Austrian construction software"
org: ib-data (ABK)
role: Software Engineer
period: Oct 2022 – Feb 2026
draft: true
order: 3
summary: "Turned construction PDFs into structured data with LLM/VLM extraction and human review, and replaced legacy full-text search with semantic search on pgvector — in production, on-premise."
stack:
  - Python
  - FastAPI
  - LangChain
  - PostgreSQL/pgvector
  - LLM/VLM document extraction
  - Docker
  - TeamCity
metrics:
  - label: Tenure
    value: 3 years
links:
  - label: ABK
    url: https://abk.at
  - label: ABK9 platform
    url: https://abk9.com
---

## Problem

Construction work arrives as documents — PDFs, Excel sheets, drawings — and the standardised Austrian construction descriptions that the software actually operates on are a different shape entirely. On top of that, finding anything in that corpus meant legacy full-text search, which matches words rather than meaning. Both problems sat in front of a long-lived product with a legacy Delphi backend that could not simply be rewritten.

## What I built

I built a FastAPI pipeline that converts PDFs into structured data using LLM/VLM processing with human review in the loop, and prototyped a document-to-specification pipeline converting PDF and Excel sources into standardised Austrian construction descriptions. Alongside that I delivered a semantic search proof of concept on PostgreSQL/pgvector, and a LangChain + FastAPI microservice that summarises construction documents for the legacy Delphi backend. I also trained a YOLOv8 model, with labelling pipelines in Label Studio, to detect doors, windows and stairs in construction drawings.

## How it works

Documents go through LLM/VLM extraction into structured records, and a human review step gates the output rather than trusting extraction blindly — the domain is one where a wrong quantity is expensive. Search runs over pgvector embeddings in the same PostgreSQL the product already used, so semantic retrieval was added without introducing a separate search cluster. The summarisation service is a separate LangChain + FastAPI microservice the Delphi backend calls, which is how new AI capability reached an old codebase without touching it; it ships on-premise via Docker and TeamCity.

## Result

The semantic search proof of concept improved both relevance and latency over the legacy full-text search. The document work moved PDFs and Excel sources into structured, standardised construction descriptions instead of manual re-entry, and the summarisation microservice gave a legacy Delphi system LLM features through a clean service boundary. All of it ran on-premise, in production, for a customer base in a domain I had trained in before I wrote software for it.

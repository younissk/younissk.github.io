---
title: "AI4Emergency: retrieval, QA and agents for safety-critical comms"
org: ONDEWO
role: AI Engineer
period: Mar 2026 – Present
order: 1
draft: true
summary: "Building the retrieval, testing and agent infrastructure behind AI-driven emergency communication for disaster and large-event operations, on an Austrian funded research project."
stack:
  - Python
  - LangGraph
  - MCP
  - gRPC
  - Retrieval-augmented generation
  - LLM evaluation
links:
  - label: ONDEWO
    url: https://ondewo.com
---

## Problem

Emergency communication in disaster and large-event scenarios is safety-critical: the answer an operator or caller gets has to be grounded in current, authoritative material, and a change to an agent must not silently break something that worked yesterday. AI4Emergency is an Austrian funded research project developing AI-driven communication technologies for exactly that setting. The hard part is not the model — it is keeping the knowledge current and the behaviour verifiable.

## What I built

I built the web-crawling and ingestion pipeline that supplies retrieval-augmented generation with source material, and exposed it to the rest of the system through a gRPC facade so downstream services integrate against a stable contract rather than against the crawler. On top of that I created an automated LLM QA pipeline that tests agent changes for regressions, which makes test-driven development possible for agents. I also built production-grade MCP servers and LangGraph agents for emergency-service workflows.

## How it works

Crawling and ingestion run as their own pipeline and publish through a gRPC facade, so the dialogue side consumes retrieval over a defined interface and the ingestion internals can change without breaking callers. Agent behaviour is exercised by the LLM QA pipeline on every change: a change is evaluated against expected behaviour before it lands, so regressions surface as failing checks rather than as incidents. Domain capabilities are packaged as MCP servers, and the emergency-service workflows themselves are orchestrated as LangGraph agents that call into those servers.

## Result

The project has retrieval that stays current through automated crawling and ingestion, a stable gRPC integration point for downstream services, and an agent test loop that catches regressions before deployment. The work is ongoing.

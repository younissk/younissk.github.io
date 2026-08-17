---
title: nanoBeard
repoName: NanoBeard-App
summary: Pirate-themed mobile chat app running small language models fully on-device through llama.cpp, with GGUF models fetched on demand.
year: 2026
period: "2026"
category: mobile
tags: [on-device-llm, llama-cpp, gguf, expo, offline-first]
stack: [TypeScript, React Native, Expo, llama.rn, Jest, Maestro]
status: active
repo: https://github.com/younissk/NanoBeard-App
demo: null
paper: null
private: false
featured: true
---
A chat app where inference happens on the phone. Models ship as GGUF files pulled from Hugging Face on first use, and that download is the only network call the app makes — no accounts, no analytics, no server round-trip for a message.

The engineering weight sits in the installer rather than the chat UI: free-space checks before download, retry with backoff, abort-aware cancellation, and integrity verification against a size floor plus the GGUF magic bytes, with failures surfaced to the user with a retry path instead of silently resetting model state. Bundled models can be seeded from the app package for a genuinely offline first launch. Tested with Jest unit tests plus five Maestro device flows covering onboarding, chat and model management.

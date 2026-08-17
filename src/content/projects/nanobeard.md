---
title: "nanoBeard"
repoName: nanoBeard
summary: A small pirate-themed GPT trained from scratch on a piratized TinyStories corpus and then SFT-tuned, with a versioned training codebase.
year: 2026
period: "2026"
category: ai-ml
tags: [llm, pretraining, sft, pytorch, tokenizer]
stack: [Python, PyTorch, Hugging Face, Gradio, MkDocs]
status: shipped
private: false
featured: true
links:
  - { kind: site, label: "Open it", url: "https://younissk.github.io/nanoBeard/" }
  - { kind: repo, label: "Training code", url: "https://github.com/younissk/nanoBeard" }
  - { kind: repo, label: "iOS app", url: "https://github.com/younissk/NanoBeard-App" }
  - { kind: model, label: "sloop-14M", url: "https://huggingface.co/younissk/nanoBeard-sloop-14M" }
  - { kind: model, label: "galleon-34M", url: "https://huggingface.co/younissk/nanoBeard-galleon-34M" }
  - { kind: model, label: "sloop-14M GGUF", url: "https://huggingface.co/younissk/nanoBeard-sloop-14M-GGUF" }
  - { kind: model, label: "galleon-34M GGUF", url: "https://huggingface.co/younissk/nanoBeard-galleon-34M-GGUF" }
  - { kind: model, label: "frigate-125M GGUF", url: "https://huggingface.co/younissk/nanoBeard-frigate-125M-GGUF" }
  - { kind: model, label: "frigate-360M GGUF", url: "https://huggingface.co/younissk/nanoBeard-frigate-360M-GGUF" }
---

A from-scratch language model trained on a piratized version of TinyStories, then supervised
fine-tuned, closer to nanoGPT than to a production LM, and honest about it. The first ship-class,
Sloop, is published on Hugging Face; later classes (Brig, Frigate, Galleon) are configs in the same
codebase.

A chat app where inference happens on the phone. Models ship as GGUF files pulled from Hugging Face on first use, and that download is the only network call the app makes, no accounts, no analytics, no server round-trip for a message.

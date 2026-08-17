---
title: Falcon-Twig
repoName: falcon-twig
summary: Fine-tuning run for Falcon H1 7B on tool calling that underperformed the base instruct model, written up as a technical report.
year: 2025
period: "2025"
category: ai-ml
tags: [llm, fine-tuning, tool-calling, negative-result]
stack: [Python, PyTorch, Transformers, Makefile]
status: shipped
private: false
featured: true
links:
  - { kind: paper, label: "Paper", url: "/papers/falcon-twig-technical-report/" }
  - { kind: model, label: "Falcon-Twig-7B", url: "https://huggingface.co/younissk/Falcon-Twig-7B" }
  - { kind: repo, label: "Code", url: "https://github.com/younissk/falcon-twig" }
---

I was really interested in how people used Tools from OpenAI in the past and how LLMs have evolved. I wanted to explore how I could use tools to enhance the performance of LLMs. So I finetuned the Falcon H1 model to use tools.

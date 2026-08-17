---
title: DISCO
repoName: DISCO-v0.1
summary: CLIP-based classifier for detecting implicit suggestive imagery, trained on a hand-labelled fashion dataset and published on Hugging Face.
year: 2025
period: "2025"
category: ai-ml
tags: [computer-vision, clip, content-moderation, child-safety]
stack: [Python, PyTorch, Transformers, CLIP, Jupyter]
status: shipped
private: false
featured: false
links:
  - { kind: model, label: "Model", url: "https://huggingface.co/younissk/DISCO-v0.1" }
  - { kind: repo, label: "Code", url: "https://github.com/younissk/DISCO-v0.1" }
---

DISCO, Detection of Implicit Suggestive Content Overlays, is an image classifier built on top of
`openai/clip-vit-base-patch32` for a moderation gap the large platforms handle badly: content that
is not explicit, and therefore passes NSFW filters, but is clearly suggestive and reaches children
on services like YouTube Kids and Roblox.

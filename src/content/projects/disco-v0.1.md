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
repo: https://github.com/younissk/DISCO-v0.1
demo: https://huggingface.co/younissk/DISCO-v0.1
paper: null
private: false
featured: false
tool:
  tagline: A CLIP-based classifier that flags suggestive imagery standard NSFW filters miss, published on Hugging Face with its labelling rules attached.
  url: "https://huggingface.co/younissk/DISCO-v0.1"
  internal: false
  status: "live"
video: null
post: null
---

DISCO, Detection of Implicit Suggestive Content Overlays, is an image classifier built on top of
`openai/clip-vit-base-patch32` for a moderation gap the large platforms handle badly: content that
is not explicit, and therefore passes NSFW filters, but is clearly suggestive and reaches children
on services like YouTube Kids and Roblox.

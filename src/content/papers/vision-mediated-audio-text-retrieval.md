---
title: "Vision-Mediated Learning for Audio–Text Retrieval"
authors:
  - "Youniss Kandah"
venue: "Bachelor Thesis — Institute of Computational Perception, Johannes Kepler University Linz"
year: 2025
type: "thesis"
pdf: "/papers/Kandah_2025_Vision-Mediated-Learning-for-Audio-Text-Retrieval.pdf"
url: null
doi: null
bibtex: |
  @thesis{kandah2025vision,
    title       = {Vision-Mediated Learning for Audio--Text Retrieval},
    author      = {Kandah, Youniss},
    school      = {Johannes Kepler University Linz},
    type        = {Bachelor's Thesis},
    address     = {Linz, Austria},
    year        = {2025},
    month       = {10},
    note        = {Institute of Computational Perception. Supervisor: Shah Nawaz},
  }
---

Current state-of-the-art language-based audio retrieval systems rely on fine-tuning audio and Text
embedding models, which are compared using contrastive loss. In our approach, we first generate
embeddings for audio and text, then create images from these embeddings, and finally train a simple
Vision Transformer to make the retrieval decisions. We evaluate on Clotho and report retrieval
metrics Recall@{1, 5, 10} and mean Average Precision (mAP@10) for both directions (audio → text,
text → audio). Compared to a baseline, the visual-proxy variant underperforms on all metrics. To
support reproducibility, we provide a structured codebase with very simple, clear instructions.
Overall, our findings indicate that the dual-encoder baseline remains stronger under modest data
and compute.

## What came of it

The idea was worth testing: if I rendered an embedding as an image, could a Vision Transformer
learn the audio–text matching that a dual encoder normally does? At this scale, no. The visual
proxy lost to the baseline on every metric.

I am publishing it as a negative result because it is one. The score is not the point. The point
is that the question is answered now, and there is a codebase anyone can run to check it.

Supervised by Dr. Shah Nawaz at the Institute of Computational Perception. The related DCASE 2025
work is in [the Task 6 technical report](/papers/dcase-2025-language-based-audio-retrieval/), and
the code that renders embeddings as images is in the
[embed2image-contrastive-retrieval](/projects/embed2image-contrastive-retrieval/) repository.

---
title: "LLM-Based Recommender Systems"
authors:
  - "Youniss Kandah"
venue: "JKU Linz — Seminar Paper"
year: 2025
type: "seminar-paper"
pdf: "/papers/LLM-Based-Recommender-Systems.pdf"
url: null
doi: null
bibtex: |
  @techreport{kandah2025llmrecsys,
    title       = {LLM-Based Recommender Systems},
    author      = {Kandah, Youniss},
    institution = {Johannes Kepler University Linz},
    year        = {2025},
    month       = {may},
    type        = {Seminar Paper},
    note        = {Preprint, under review}
  }
---

Large language models (LLMs) are reshaping recommender systems by bringing deep semantic
understanding and text generation into pipelines that traditionally relied on sparse IDs
and task-specific models. This survey shows how LLMs improve cold-start accuracy,
explanation quality and user engagement, and compares four representative methods
(BERT4Rec, P5, TIGER and a headline-generation framework) against a matrix-factorisation
baseline. On MovieLens-1M, LLM variants raise Recall@20 by up to 44%, while an online A/B
test reports a 7–10% click-through lift from LLM-generated headlines. This paper outlines
the trade-off between these gains and a ten-fold rise in inference cost, discusses privacy
and carbon-footprint concerns, and argues that hybrid retrieval–generation pipelines and
pre-generated content caches will be key to practical deployment. Finally, this paper
highlights multimodal dynamic personalisation, e.g. combining adaptive titles and
thumbnails — as a promising research frontier.

The paper surveys six paradigms of LLM-based recommendation: sequential transformers
(BERT4Rec), the unified text-to-text paradigm (P5), generative retrieval (GPT4Rec),
semantic-ID generation (TIGER and LIGER), prompt-based content enrichment (LLM-Rec), and
dynamic title personalisation, after first grounding them in the classical
collaborative-filtering, content-based and graph-based paradigms they extend.

**What I took from it.** I put the cost next to the accuracy gain, because that is the
part I wanted to know: Recall@20 up by as much as 44%, against roughly ten times the
inference cost, plus the privacy and carbon consequences of putting a generative model in
a hot serving path. The recommendation I landed on was to cache the generations rather
than generate per request.

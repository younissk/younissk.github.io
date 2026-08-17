---
title: "Falcon-Twig Technical Report"
authors:
  - "Youniss Kandah"
venue: "Independent Research — Technical Report (Preprint)"
year: 2025
type: "technical-report"
pdf: "/papers/Falcon_Twig_Technical_Report.pdf"
url: "https://github.com/younissk/falcon-twig"
doi: null
bibtex: |
  @techreport{kandah2025falcontwig,
    title       = {Falcon-Twig Technical Report},
    author      = {Kandah, Youniss},
    year        = {2025},
    month       = {sep},
    type        = {Technical Report},
    note        = {Preprint, under review. QLoRA fine-tuning of Falcon-H1 for tool calling, evaluated on BFCL},
    url         = {https://github.com/younissk/falcon-twig}
  }
---

I attempted to fine-tune Falcon-H1 for reliable tool-calling and observed persistent
failures. I document the setup, data format, training procedure, and evaluation, and
analyze the failure. We aim to save others time by providing clear negative results,
complete configs, and concrete checklists.

The report starts from the observation that tool-calling is becoming a load-bearing
capability for LLMs, since it is what turns natural language into real automation. TII's
Falcon-H1 series — instruction-tuned models with a hybrid attention plus state-space
design aimed at long context and fast inference — was chosen as the base. A custom
dataset mixing several public tool-calling corpora, synthetic examples, and deliberately
non-tool-calling data was curated, and Falcon-H1 was fine-tuned with QLoRA. The
resulting model, Falcon Twig, was re-evaluated on the Berkeley Function-Calling
Leaderboard (BFCL) and underperformed. Baseline BFCL numbers for Falcon-H1-0.5B-Instruct
are included for comparison (10.68% overall accuracy, 0.00% multi-turn, 87.50% relevance
detection), alongside a cross-size sweep showing that the 7B model lands within a few
points of the 34B model on live simple AST — a clear cost-benefit result — while none of
the sizes handled parallel tool calls.

**Why it matters.** Negative results in fine-tuning are almost never published, so
everyone rediscovers the same dead ends privately. This report does the opposite: it
ships the failure with the full setup, the data format, the training config, and the
evaluation harness attached, so the next person can either avoid the approach or debug
past the point where it broke. It also demonstrates end-to-end ownership of a modern
post-training loop — dataset curation, QLoRA on a hybrid-architecture base model, and
benchmark-driven evaluation on BFCL — plus the willingness to publish a result that
did not flatter the author.

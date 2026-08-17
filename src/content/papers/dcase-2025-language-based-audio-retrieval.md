---
title: "Enhancing Language-Based Audio Retrieval with Partial Fine-Tuning and Attention Pooling"
authors:
  - "G. Filomeno"
  - "Youniss Kandah"
  - "F. Spiessberger"
venue: "DCASE 2025 Challenge — Technical Report (Task 6: Language-Based Audio Retrieval)"
year: 2025
type: "technical-report"
pdf: "/papers/Filomeno_JKU_task6_1.technical_report.pdf"
url: "https://dcase.community/documents/challenge2025/technical_reports/Filomeno_JKU_task6_1.technical_report.pdf"
doi: null
bibtex: |
  @techreport{filomeno2025enhancing,
    title       = {Enhancing Language-Based Audio Retrieval with Partial Fine-Tuning and Attention Pooling},
    author      = {Filomeno, G. and Kandah, Y. and Spiessberger, F.},
    institution = {Johannes Kepler University Linz},
    year        = {2025},
    month       = {jun},
    type        = {DCASE2025 Challenge Technical Report},
    note        = {Task 6: Language-Based Audio Retrieval},
    url         = {https://dcase.community/documents/challenge2025/technical_reports/Filomeno_JKU_task6_1.technical_report.pdf}
  }
---

This technical report describes our submission to the language-based audio retrieval task
of the DCASE 2025 Challenge (Task 6). Building upon our previous work, we retain the
dual-encoder architecture that projects audio recordings and textual descriptions into a
shared embedding space. This year we focus on architectural and training-level refinements
within a single model framework. Specifically, we fine-tune only the upper transformer
layers of a PaSST audio encoder, apply attention-based segment pooling, and replace CLS
token extraction in RoBERTa with masked mean pooling. Additionally, we introduce
time-frequency spectrogram augmentation and reduce the hop size to capture more segment
detail. Our improved system achieves a mAP@10 of 36.005 on the ClothoV2 test set,
outperforming the official DCASE 2025 baseline without relying on external caption
generation or model ensembles. The result for mAP@16 is 36.661 (without new annotations).
All code and trained models are available on GitHub.

*Index terms:* audio-text retrieval, dual encoder, PaSST, attention pooling, fine-tuning,
ClothoV2.

The submission placed **5th** in DCASE 2025 Task 6, and the report is hosted on the
official DCASE website. Work was carried out as students at Johannes Kepler University,
Linz.

**Why it matters.** The prevailing way to win audio-retrieval benchmarks is to bolt on
more machinery — knowledge distillation from an ensemble of pretrained models, synthetic
caption generation, model soups. This system beats the official baseline by going the
other way: one model, no ensemble, no synthetic captions, with the gains coming from
deliberate architectural choices (which layers to unfreeze, how to pool segments, how to
pool tokens) and a systematic encoder-pairing sweep that showed architecture compatibility
between the audio and text side matters more than extra data or loss engineering. That is
a cheaper, more reproducible, and more transferable result than a bigger ensemble, and it
was validated in open competition against the field.

---
title: "DCASE 2025 Task 6: language-based audio retrieval"
org: JKU Linz
role: Team member
period: "2025"
order: 4
summary: "Placed 5th in the DCASE 2025 language-based audio retrieval challenge and published a peer-reviewed technical report on the official DCASE site."
stack:
  - PyTorch
  - Contrastive learning
  - Audio-text embeddings
  - Information retrieval
metrics:
  - label: Placement
    value: 5th, DCASE 2025 Task 6
links:
  - label: Challenge results
    url: https://dcase.community/challenge2025/task-language-based-audio-retrieval-results
  - label: Technical report
    url: https://dcase.community/documents/challenge2025/technical_reports/Filomeno_JKU_task6_1.technical_report.pdf
---

## Problem

Language-based audio retrieval is the task of taking a free-text caption — "a fast train passes and a bell rings" — and ranking a large pool of audio clips by how well they match it. Text and audio are different modalities with no shared vocabulary, so there is nothing to match on directly. DCASE 2025 Task 6 is the public benchmark for this, scored against submissions from other teams.

## What I built

I competed in the DCASE 2025 challenge on language-based audio retrieval as part of a JKU team, and we published a peer-reviewed technical report documenting the system. The same problem is the subject of my BSc thesis at JKU, on deep learning for language-based audio retrieval.

## How it works

The system is a dual encoder: an audio encoder and a text encoder map clips and captions into one shared embedding space, trained with a contrastive objective so matching pairs pull together and mismatched pairs push apart. Once both modalities live in the same space, retrieval reduces to nearest-neighbour search over the audio embeddings. The published technical report carries the exact configurations and ablations.

## Result

The submission placed 5th in DCASE 2025 Task 6, and the technical report went through peer review and is hosted on the official DCASE site. It is the piece of work where my results are ranked against other teams on a public leaderboard rather than described by me.

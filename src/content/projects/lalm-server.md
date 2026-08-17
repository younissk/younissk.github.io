---
title: LALM Server
repoName: lalm-server
summary: FastAPI wrapper that loads a large audio-language model once at startup and answers questions about uploaded audio files.
year: 2025
period: "2025"
category: ai-ml
tags: [audio-llm, inference-server, fastapi, huggingface]
stack: [Python, FastAPI, Transformers, PyTorch]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---
A small serving layer for audio-language models. The model and processor load inside a FastAPI lifespan handler so the weights are paid for once at startup rather than per request, with bfloat16 on CUDA and float32 otherwise, and a supported-models enum covering NVIDIA Audio Flamingo 3 and SeaLLMs-Audio-7B. Endpoints take an audio upload plus a question. Deliberately small — a spike to find out what serving this model class actually costs.

---
title: AI assignment grader for a Circle community
repoName: c4h-ai-assignment-grader
summary: Scheduled job that polls a Circle community for new assignment submissions, grades them with an LLM and posts feedback back.
year: 2025
period: "2025"
category: ai-ml
tags: [llm, automation, grading, education]
stack: [Python, OpenAI API, Vercel, Circle API]
status: shipped
repo: null
demo: https://c4h-ai-assignment-grader.vercel.app
paper: null
private: true
featured: false
---

A scheduled function checks the community's submissions space every fifteen minutes, and any post it has not seen before is handed to an LLM agent that evaluates it against predefined grading criteria and writes the result back into the community as a reply.

The design constraint is that the community platform is the only interface — students never leave Circle, and there is no separate submission portal to maintain. Reference solutions live in the repo alongside the grading criteria, so the rubric is version-controlled rather than living in a prompt someone edited once.

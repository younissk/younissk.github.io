---
title: BaudatenAI
repoName: BaudatenAI
summary: Proof of concept that parses Austrian ONLV construction tender files and product PDFs into JSON and generates item descriptions with GPT.
year: 2024
period: "2024"
category: ai-ml
tags: [llm, document-parsing, construction, poc]
stack: [Python, Jupyter, SQLite, OpenAI API]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

Client proof of concept for ABK, working on Austrian construction tender data. The pipeline takes
ONLV bill-of-quantities exports and supplier PDFs, reduces them to structured JSON, stores them in a
local SQLite database, and uses GPT to generate and summarise item descriptions against that
structured extract rather than against raw text.

Mostly notebooks driving a small `abk_ai` package — the ONLV parser, the PDF-to-JSON step, the
database layer and the generation step are each separable, which is what a POC needs to be when the
question is which stage is actually worth productionising.

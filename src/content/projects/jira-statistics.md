---
title: Jira Sprint Statistics
repoName: jira-statistics
summary: Pulls Jira sprint data and renders standalone HTML reports on story-point distribution, time accuracy and multi-sprint trends.
year: 2025
period: "2024–2025"
category: data
tags: [jira, reporting, analytics, agile]
stack: [Python, pandas, Jupyter, HTML]
status: archived
repo: null
demo: null
paper: null
private: true
featured: false
---

A reporting tool for agile retrospectives: `GenerateSprintData.py` fetches sprint data from Jira, notebooks do the analysis, and the output is a self-contained HTML report with charts — story point distributions, estimated versus actual time accuracy across sprints, top issues by time spent, and cross-sprint trend views.

Overhead history is tracked in JSON between runs so multi-sprint comparisons hold up over time. The README is kept as a running list of what the current charts get wrong, which is a fair description of where the project stopped.

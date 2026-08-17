---
title: Course certificate generator
repoName: certificate-sender
summary: Python script that renders a personalised PDF completion certificate per participant from a CSV of course attendees.
year: 2024
period: "2024"
category: tooling
tags: [pdf, automation, education, reportlab]
stack: [Python, ReportLab, pandas, Jupyter]
status: shipped
repo: null
demo: null
paper: null
private: true
featured: false
---

Reads the participant list with pandas and draws each certificate with ReportLab — landscape A4, a drawn border, the German award text, the participant's name and the course period — writing one PDF per person into an output folder. Small, single-purpose, and it removed a manual step at the end of every course run.

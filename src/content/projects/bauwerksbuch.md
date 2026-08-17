---
title: Bauwerksbuch
repoName: Bauwerksbuch
summary: Spring Boot and React MVP for recording building defects and remediation measures against statutory inspection deadlines.
year: 2026
period: "2026"
category: web
tags: [compliance, crud, jwt-auth, mvp]
stack: [Java, Spring Boot, TypeScript, React, PostgreSQL, MinIO, Docker]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

A scaffold for a building-records product: buildings CRUD, defects and measures per building, and an obligation checker that derives the statutory deadline from construction year (pre-1919 buildings fall due end of 2027, 1919–1945 end of 2030).

Backed by JWT email/password auth, Postgres, and S3-compatible document upload via presign-and-confirm endpoints against MinIO, with MailHog for local mail. Deliberately single-tenant — one stack per customer — and honest about what is a placeholder: the PDF export endpoint exists but does not yet render, and the upload flow is server-side only.

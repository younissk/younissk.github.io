---
title: Tasis al-Ilm Student Dashboard
repoName: tai-dashboard
summary: React dashboard that signs students in against a Moodle instance over OAuth2 and shows their enrolled courses and progress.
year: 2025
period: "2025"
category: teaching
tags: [moodle, oauth2, react, dashboard]
stack: [TypeScript, React, Vite, Express, shadcn/ui, Tailwind]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

A second front end for the Tasis al-Ilm school, this time sitting on top of a Moodle install rather
than a custom backend. Students authenticate through Moodle's `local_oauth` plugin; a small Express
server handles the OAuth2 exchange and proxies the Moodle web-service calls so tokens never reach
the browser bundle.

The client is a Vite + shadcn/ui dashboard with an auth context, course cards, a calendar and
progress components, plus a light/dark toggle.

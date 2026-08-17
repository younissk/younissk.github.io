---
title: Fleet Console
repoName: fleet-console
summary: Self-hosted control plane for a fleet of single-tenant VPS deployments — env editing, image rollout and onboarding over SSH.
year: 2026
period: "2026"
category: infra
tags: [self-hosting, ssh, deployment, single-tenant, control-plane]
stack: [Laravel, Inertia, React, TypeScript, Tailwind CSS, SQLite, Docker]
status: active
repo: null
demo: null
paper: null
private: true
featured: false
---

A dashboard for the "silo model": one isolated VPS per customer school, each running its own copy of the app with its own database. The console lists every box, shows live `/up` status, edits each box's production env over SSH, rolls an accepted image tag, and onboards a new school from a pasted IP — no Kubernetes anywhere.

It exists because nothing off-the-shelf matched the shape of the problem. PaaS tools like Coolify and Dokploy assume one server with many apps; managed self-hosted tools like Replicated are agent-based and vendor-to-customer shaped. This is many servers running one app each, operated by the owner. The console reads the same per-school JSON config the existing fleet shell scripts read, so there is a single source of truth rather than a second one.

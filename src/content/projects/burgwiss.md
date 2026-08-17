---
title: Burgwiss
repoName: burgwiss
summary: Single-tenant school operating platform — LMS plus payments, live classes, certificates and fleet deployment, sold to schools.
year: 2026
period: "2025–2026"
category: web
tags: [lms, saas, multi-domain, self-hosted, education]
stack: [PHP, Laravel, TypeScript, React, Inertia, Docker, PostgreSQL, LiveKit]
status: active
repo: null
demo: https://burgwiss.com
paper: null
private: true
featured: true
---

Burgwiss is a platform for building and running a school: a learning management system plus the surrounding operational tooling — identity, courses, programs, quizzes, completion tracking, certificates, payments, and live classes with recordings via LiveKit. It ships as a single-tenant deployment a school can host itself or have hosted for it.

The repository is organised around an agent-readable process document (`AGENTS.md`) rather than a conventional README, with over a hundred recorded ADRs, generated architecture docs published as a searchable MkDocs site, and runbooks for deploy, fleet management, backups and CI. A `make dev-bootstrap && make dev-preview` loop plus role-scoped dev logins gets a contributor to a running app in one command.

Technically the interesting part is the migration: an earlier Next.js codebase was removed from `main` and archived at a git tag rather than ported, so the Laravel stack at the root is the whole product. Quality tooling is unusually dense for a solo project — PHPStan, Rector, Stryker mutation testing, Vitest, Storybook, Lighthouse CI budgets, and a stress-test directory all wired into the same Makefile.

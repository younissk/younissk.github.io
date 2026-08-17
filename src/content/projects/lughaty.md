---
title: Luraty
repoName: lughaty
summary: Adaptive language trainer for heritage speakers, built around a runtime-agnostic scheduling engine with a Supabase backend.
year: 2026
period: "2026"
category: mobile
tags: [language-learning, expo, supabase, spaced-repetition, learner-model]
stack: [TypeScript, React Native, Expo, Supabase, PostgreSQL, Deno, Vitest]
status: active
repo: null
demo: null
paper: null
private: true
featured: true
---
Luraty targets the band that language apps skip: people who grew up hearing a language, understand far more than they can produce, and have outgrown A1–A2 courses. The learner model and the engine invariants are argued out in ADRs against the research literature rather than assumed.

The architectural spine is a hard split between an engine and a frontend. The engine is a separate git submodule with its own `node_modules` and no React Native anywhere in its dependency tree, and there is no root `package.json` — so an accidental RN import inside the engine simply fails to resolve. The dependency direction is enforced by the module resolver instead of by review discipline.

The Supabase side carries 18 SQL migrations, RLS policies, edge functions and pgTAP security tests. The app itself was deliberately reset to a blank Expo canvas in July 2026, with the whole prior implementation preserved as an archive branch and tag rather than deleted.

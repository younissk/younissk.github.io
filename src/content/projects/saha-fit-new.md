---
title: Saha Fit
repoName: saha-fit-new
summary: Expo/React Native fitness app with an on-device SQLite exercise catalog, workout generator, interval training and a Python data pipeline.
year: 2026
period: "2026"
category: mobile
tags: [react-native, sqlite, fitness, drizzle]
stack: [TypeScript, Expo, React Native, Drizzle ORM, SQLite, Python, Jest]
status: active
repo: null
demo: null
paper: null
private: true
featured: false
---

The current build of Saha Fit, a training app that ships its exercise catalog as a prebuilt SQLite
database rather than fetching one. The mobile app covers sessions, interval work, run tracking,
per-discipline exploration, a muscle map, goals, a week view and workout editing; a Python side of
the monorepo builds the exercise database and the embeddings used for recommendation and grouping.

Most of the engineering effort sits below the screens: a Drizzle schema with migrations, an
aggregation layer over session history, a planner and generator with their own test files, and a
Jest suite that gates every change alongside a typecheck and the Python pipeline tests. The repo
also carries an unusually detailed build guide — the native iOS build was broken three ways by a
space in the folder path, and the fix plus the remaining CocoaPods locale gotcha are documented so
they are never re-derived.

Supersedes two earlier attempts at the same app: an Ionic scaffold (`saha-fit-b3oxw4`) and an Expo
starter (`Saha`).

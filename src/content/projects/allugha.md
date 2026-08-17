---
title: Allugha
repoName: allugha
summary: Cross-platform Arabic course app — Firebase-backed courses, lessons and progress, wrapped for Android and iOS with Capacitor.
year: 2024
period: "2024"
category: mobile
tags: [arabic, capacitor, firebase, language-learning]
stack: [TypeScript, React, Vite, Capacitor, Firebase]
status: archived
repo: null
demo: null
paper: null
private: true
featured: false
---
A mobile Arabic-learning app built as a React web app and shipped natively through Capacitor. It has auth, a course catalogue, lesson lists and a lesson view, a dashboard showing the current course, and a profile page, with Firebase hooks for user and enrolled-course state and small Zustand-style stores driving the app bar and bottom navigation. Components are organised atoms/molecules.

An earlier take on the same idea, `ionic-arabic`, used the Ionic React stack instead and had gone slightly further on the data model (courses, lessons, exercises as separate collections with hooks per entity) before being restarted here on plain React plus Capacitor.

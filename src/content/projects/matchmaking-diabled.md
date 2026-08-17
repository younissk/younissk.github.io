---
title: Matchmaking for Disabled Users
repoName: matchmaking-diabled
summary: Svelte and Firebase matchmaking app aimed at disabled users, with profiles, match requests and search filtered by age and background.
year: 2022
period: "2022"
category: web
tags: [svelte, firebase, matchmaking, accessibility]
stack: [Svelte, Vite, Firebase]
status: archived
repo: null
demo: null
paper: null
private: true
featured: false
---

A matchmaking site for a group that mainstream dating products serve badly. Users create a profile,
search the opposite-gender pool with filters over nationality, ethnicity and age range, and send
match requests that the other side accepts or declines.

Svelte with a small store layer over Firebase — auth state, the user list and the request store are
each their own writable — and route guards that bounce anyone without a loaded profile back to
login.

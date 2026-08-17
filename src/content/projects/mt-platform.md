---
title: MT Platform
repoName: mt_platform
summary: Svelte and Firebase community platform with courses, posts, comments and one-to-one chat, wrapped for mobile with Capacitor.
year: 2022
period: "2022"
category: web
tags: [svelte, firebase, capacitor, community]
stack: [Svelte, Rollup, Firebase, Capacitor]
status: archived
repo: null
demo: null
paper: null
private: true
featured: false
---

A combined learning and community app: a course area with a lesson list and navigator, a feed with
posts and comments, profiles, and a chat with conversation list, message view and composer. The
routing is hand-rolled on top of a Svelte router, and the whole thing is packaged through Capacitor
so the same build runs as a mobile app.

Organised strictly by feature — every screen owns its own `components/` folder — which is the part
that still holds up; the shared surface is just a Firebase util and a store module.

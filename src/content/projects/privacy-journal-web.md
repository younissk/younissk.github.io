---
title: Privacy Journal
repoName: privacy-journal-web
summary: Journalling app that stores every entry in the user's own private GitHub repo, with Whisper voice-note transcription.
year: 2025
period: "2025"
category: web
tags: [github-api, whisper, journaling, byo-storage]
stack: [TypeScript, React, Chakra UI, Vite, GitHub API, OpenAI Whisper]
status: experiment
repo: https://github.com/younissk/privacy-journal-web
demo: null
paper: null
private: false
featured: true
---

A privacy-first journaling app with all journals stored in the user's own private GitHub repo. I also added a voice-to-text feature using OpenAI Whisper, because I was annoyed at how bad Apple's speech-to-text was.

The premise is that a journal app should not hold your journal. You log in with GitHub, the app provisions a private repo under your account, and entries, folders, chats and flow definitions are written there as files — the app keeps no server-side copy. Voice notes record in the browser and transcribe through OpenAI Whisper with your own key.

Beyond the editor it grew guided journal flows (a flow editor and a runner), folders, and a chat surface over past entries.

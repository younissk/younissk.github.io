---
title: Privacy Journal
repoName: privacy-journal
summary: Expo journaling app that keeps entries on the device, with habit tracking, guided journal flows, custom themes and data export.
year: 2024
period: "2024"
category: mobile
tags: [react-native, journaling, offline-first, privacy]
stack: [TypeScript, Expo, React Native]
status: shipped
repo: https://github.com/younissk/privacy-journal
demo: https://privacy-journal.vercel.app
paper: null
private: false
featured: true
---

A privacy-first, all-on-device journaling app with all the features I wanted but couldn't find anywhere else. I stopped, though, because I did not want to pay the App Store fees.

A journaling app with the storage decision made first: nothing leaves the phone. Around that
constraint sit habits, journal entries, and "flows" — guided multi-prompt sessions built from
editable quote packs — plus a theme customiser and separate export screens for journals and for the
full data set, since a local-only app has to make getting your data out someone else's problem.

Written with Expo Router, one screen per file, including the native iOS and Android projects.

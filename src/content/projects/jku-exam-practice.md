---
title: JKU Exam Practice
repoName: jku-exam-practice
summary: Web app where JKU students add, share and drill each other's exam questions, with LaTeX rendering, timed tests and an XP indicator.
year: 2025
period: "2024–2025"
category: teaching
tags: [education, firebase, react, spaced-practice]
stack: [TypeScript, React, Vite, Firebase, Netlify]
status: shipped
repo: https://github.com/younissk/jku-exam-practice
demo: https://jku-exam-simulator.netlify.app
paper: null
private: false
featured: true
---

I created an exam simulator for JKU students to practise for their exams. It started solo, but it is open source now.

A study tool for students at JKU Linz: anyone can add exam questions, group them into decks by
subject, and practise them as timed tests. Because the subjects are maths-heavy, questions render
LaTeX and are edited through an HTML editor rather than a plain textarea.

Built on Firebase with decks, subjects, tests, users and feedback as first-class collections, and
deployed on Netlify with a public feedback page and open issues used as the contribution route. The
README is refreshingly blunt about the state of the code and about not having decided yet whether
the project is open source or merely public source.

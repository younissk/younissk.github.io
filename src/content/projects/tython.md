---
title: Tython
repoName: tython
summary: A statically typed, deliberately opinionated toy language with its own parser, standard library and Python interop.
year: 2026
period: "2026"
category: tooling
tags: [programming-language, parser, interpreter, dsl, python]
stack: [Python, Make, MkDocs, Vim]
status: active
private: false
featured: true
links:
  - { kind: site, label: "Open it", url: "https://younissk.github.io/tython/" }
  - { kind: repo, label: "Code", url: "https://github.com/younissk/tython" }
---

A language designed around the idea that both humans and language models read code more reliably when the syntax leaves less room for choice: everything is statically typed, `const`/`var` mutability is explicit, class methods are private unless marked `pub`, `init` fields skip the `self.x = x` boilerplate, and `this` replaces the explicit `self` parameter.

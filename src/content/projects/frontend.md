---
title: Course platform frontend
repoName: frontend
summary: Next.js storefront for an online course platform, wiring a Strapi backend to Clerk authentication and PayPal checkout.
year: 2025
period: "2025"
category: web
tags: [nextjs, headless-cms, auth, payments]
stack: [Next.js, TypeScript, Strapi, Clerk, PayPal]
status: experiment
repo: null
demo: null
paper: null
private: true
featured: false
---

Course listing, teacher and contact pages backed by a Strapi CMS, with Clerk handling sign-in and a webhook route at `/api/webhooks/clerk` keeping Strapi's user records in sync when Clerk fires. Checkout renders PayPal buttons in the browser and creates the order server-side, with a sandbox/live switch through an env flag.

The env contract is the notable part — the README enumerates every key the two services need on both the browser and the server side, which is what makes the Clerk-to-Strapi sync reproducible rather than folklore.

---
title: Tasis al-Ilm student portal
repoName: tasis-al-ilm-user-portal
summary: Next.js student portal for an online Islamic-studies school — PayPal orders and subscriptions, Moodle courses and Drive-hosted recordings.
year: 2025
period: "2024–2025"
category: web
tags: [nextjs, payments, moodle, firebase]
stack: [TypeScript, Next.js, NextAuth, Firestore, PayPal API, Moodle API, Google Drive API]
status: shipped
repo: null
demo: null
paper: null
private: true
featured: false
---
The student-facing side of a school: sign in, browse offers, buy a course or subscribe, then reach the course content. The work sits mostly in the API routes — PayPal product, plan, order-capture, subscribe and cancel flows; Moodle course listing and single-course fetch; Drive-backed lesson recordings resolved per group folder; and offer management on top of Firestore.

Purchases are recorded as their own Firestore collection with references back onto the user document, so a user's entitlements are readable without replaying payment webhooks. A later, separate attempt at rebuilding the frontend against Strapi lives in `tasis-al-ilm-frontend`, which got as far as auth, enrollment and billing components before stalling.

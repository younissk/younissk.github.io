---
title: ABK Kundenplattform
repoName: abk-kundenplattform
summary: German customer portal for a software vendor — support tickets, training bookings, company data management and an admin change queue.
year: 2023
period: "2023"
category: web
tags: [react, mui, customer-portal, german]
stack: [TypeScript, React, Material UI, Create React App]
status: archived
repo: null
demo: null
paper: null
private: true
featured: false
---
A customer-facing platform organised as vertical feature slices — login, tickets, Schulungen (training), support, and Verwaltung (administration) — each owning its own screens and components rather than being split by technical layer. Customer and colour-mode state sit in React contexts with typed interfaces for the auth, contact and customer payloads.

The admin side is the notable piece: customers submit changes to their own master data, and an admin dashboard reviews them through a change table with a swipe-to-decide component for touch.

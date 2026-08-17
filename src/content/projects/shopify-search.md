---
title: Shopify Search
repoName: shopify-search
summary: Product discovery engine that scrapes thousands of Shopify storefronts and serves embedding-based search over the aggregate catalogue.
year: 2025
period: "2025"
category: web
tags: [search, embeddings, web-scraping, ecommerce]
stack: [TypeScript, Next.js, Python, Supabase, Tailwind CSS, uv]
status: experiment
repo: https://github.com/younissk/shopify-search
demo: null
paper: null
private: false
featured: true
---

I created a search engine across Shopify stores, covering 580k products. I added functionality for semantic search and a content-based recommender system.

Shopify stores all expose a predictable `products.json` endpoint, which is the whole premise: a Python scraping layer walks a domain list, pulls product feeds and store metadata, and generates embeddings, while a Next.js frontend on Supabase serves search across the combined index.

The pipeline is split into discrete scripts — domain population, metadata scrape, product fetch, embedding creation — so each stage can be re-run independently as the domain list grows.

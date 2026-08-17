---
title: Cities Quiz
repoName: CitiesQuiz
summary: Geography quiz backend over a scraped world-cities dataset, with a Spring Boot REST layer and a Wikipedia scraper feeding it.
year: 2023
period: "2023"
category: games
tags: [spring-boot, web-scraping, geography, rest-api]
stack: [Java, Spring Boot, Maven, Python, BeautifulSoup]
status: archived
repo: null
demo: null
paper: null
private: true
featured: false
---

Two halves that meet at a CSV. A Python Wikipedia scraper builds per-continent city datasets, and a Spring Boot service exposes them through a city controller, entity, repository and service layer so a quiz frontend can pull questions from real data rather than a hardcoded list.

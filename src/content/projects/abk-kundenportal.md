---
title: ABK Customer Portal API
repoName: ABK-KundenPortal
summary: Spring Boot REST API for customer records, contacts and change requests, with JWT auth backed by a SQL user store.
year: 2023
period: "2023"
category: web
tags: [spring-boot, rest-api, jwt-auth, java]
stack: [Java, Spring Boot, Spring Security, Maven, SQL]
status: archived
repo: null
demo: null
paper: null
private: true
featured: true
---

I led the development of a client portal system in collaboration with another developer. The platform streamlines client interactions and improves operational efficiency.

A customer portal backend structured the conventional Spring way — controllers, services, repositories and JPA models for customers (`Kunde`), contacts (`Kontakt`) and change records (`Aenderung`).

The security layer is the substantive part: a custom `UserDetailsManager` reading users from SQL, RSA key properties for token signing, and a JWT validation filter inserted into the Spring Security chain rather than relying on the default session flow.

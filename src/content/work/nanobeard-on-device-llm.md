---
title: "nanoBeard: a small language model trained from scratch, shipped on the App Store"
org: Self-directed project
role: Sole developer
period: "2026"
draft: true
order: 2
summary: "I trained a small language model from scratch and shipped it as an on-device iOS app — training, packaging and App Store release taken end to end by one person."
stack:
  - PyTorch
  - Small language model training
  - On-device inference
  - iOS
links:
  - label: Project page
    url: https://younissk.github.io/nanoBeard/
  - label: App Store
    url: https://apps.apple.com/at/app/nanobeard/id6776172780?l=en-GB
---

## Problem

Most language-model work stops at a notebook or an API call to somebody else's endpoint. I wanted the whole path instead: train a model from scratch, get it small enough to run on a phone, and put it in front of real users through the App Store — the parts that are usually somebody else's job.

## What I built

I trained a small language model from scratch and shipped it as an on-device iOS app, nanoBeard. It runs the model locally on the device rather than calling a hosted inference service. This was a self-directed project taken end to end — training, on-device integration, and the App Store release.

## How it works

Inference happens on the device, so the model has to fit the memory and compute a phone actually has, which is the constraint that drives every other decision from model size onward. Because nothing leaves the handset, there is no serving infrastructure and no network round-trip in the loop.

## Result

The app is live on the App Store, and the project page documents the work. It is the piece of my portfolio where I owned every stage — from training run to shipped binary — with no team to hand the awkward parts to.

---
title: Palestinian cuisine detection
repoName: palestinian-cuisine-detection
summary: Object detection for Palestinian dishes in photos — self-collected and labelled dataset, fine-tuned with YOLOv8 via Ultralytics.
year: 2024
period: "2024"
category: ai-ml
tags: [object-detection, yolo, computer-vision, dataset-building]
stack: [Python, Ultralytics YOLOv8, Jupyter]
status: shipped
repo: https://github.com/younissk/palestinian-cuisine-detection
demo: null
paper: null
private: false
featured: false
---
The dataset was the project. Images were scraped with a collection script, cleaned with a second script, then hand-labelled into classes of Palestinian dishes before an 80/10/10 split written out as a YOLO `data.yaml`, with fine-tuning from `yolov8x`. Written up in more detail on the author's blog.

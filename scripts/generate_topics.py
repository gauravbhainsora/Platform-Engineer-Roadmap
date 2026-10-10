#!/usr/bin/env python3
"""
Generator script to produce comprehensive, high-quality TypeScript topic data
for the Platform Engineer Roadmap based on the exact mindmap topics and
highest-rated authoritative sources (Linux Foundation, Cloudflare, RFCs,
Docker, Kubernetes, AWS, HashiCorp, Google SRE).
"""

import json
import os

TOPICS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/data/topics"))
os.makedirs(TOPICS_DIR, exist_ok=True)

print("Writing topic data modules...")

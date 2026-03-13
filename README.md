# dnsmasq_ads_filter

[![English](https://img.shields.io/badge/language-English-blue)](README.md) [![中文](https://img.shields.io/badge/language-中文-red)](README_CN.md)

Router-level ad blocking filter list for Xiaomi devices (TV, Box, Phone) using dnsmasq.

## Overview

This project provides a dnsmasq-based ad blocking list optimized for Xiaomi ecosystem devices. It blocks ads at the DNS level, providing a router-wide ad filtering solution.

## Usage

### Merlin Firmware (ASUS routers with Merlin)

**Path 1:** Software Center →科学上网 → DNS Settings → Custom dnsmasq

**Path 2:** Optional Internet → Custom dnsmasq

Copy all content from `dnsmasq-ads-filter-list.txt` and paste into the custom dnsmasq configuration.

### Xiaomi Router

Import `xiaomi-router-hosts-noad.txt` into your Xiaomi router's ad blocking settings.

## Files

| File | Description |
|------|-------------|
| `dnsmasq-ads-filter-list.txt` | Main dnsmasq filter list |
| `xiaomi-router-hosts-noad.txt` | Xiaomi router hosts file |
| `hosts-manager.html` | Web interface for managing and syncing both filter lists |

## Web Manager

Open `hosts-manager.html` in your browser to:
- Load and compare both filter lists
- View domain differences (only in Dnsmasq, only in Xiaomi, common)
- Sync domains between the two formats
- Merge both lists into one

## Contribution

Edit `dnsmasq-ads-filter-list.txt` directly and submit a Pull Request to update the list.

## License

MIT License

---

[Chinese Version](README_CN.md)

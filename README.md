# dnsmasq_ads_filter

[![English](https://img.shields.io/badge/language-English-blue)](README.md) [![中文](https://img.shields.io/badge/language-中文-red)](README_CN.md) [![Version](https://img.shields.io/badge/version-1.0.2-green)](https://github.com/sutchan/dnsmasq_ads_filter)

Router-level ad blocking filter list for Xiaomi devices (TV, Box, Phone) using dnsmasq.

## Overview

This project provides a dnsmasq-based ad blocking list optimized for Xiaomi ecosystem devices. It blocks ads at the DNS level, providing a router-wide ad filtering solution.

## Usage

### Merlin Firmware (ASUS routers with Merlin)

**Path 1:** Software Center → DNS Settings → Custom dnsmasq

**Path 2:** Optional Internet → Custom dnsmasq

Copy all content from `dnsmasq-ads-filter-list.txt` and paste into the custom dnsmasq configuration.

### Xiaomi Router

Import `xiaomi-router-hosts-noad.txt` into your Xiaomi router's ad blocking settings.

### OpenWrt

```bash
curl -sL https://raw.githubusercontent.com/sutchan/dnsmasq_ads_filter/main/dnsmasq-ads-filter-list.txt >> /etc/dnsmasq.conf
```

## Files

| File | Description |
|------|-------------|
| `dnsmasq-ads-filter-list.txt` | Main dnsmasq filter list (`address=/domain/0.0.0.0` format) |
| `xiaomi-router-hosts-noad.txt` | Xiaomi router hosts file (`0.0.0.0 domain` format) |
| `hosts-manager.html` | Web interface for managing and generating filter lists |
| `raw-domains.txt` | Unified domain list (one domain per line, source of truth) |

## Web Manager

Open `hosts-manager.html` in your browser to:

- Load and parse domain lists from URL or local file
- Choose preset sources (AdGuard, EasyList, NeoHosts, Xiaomi)
- Generate Dnsmasq or Hosts format output
- Configure IP addresses (IPv4/IPv6)
- Auto deduplicate and sort domains
- Download generated files

## Single Source Workflow

```
raw-domains.txt (Source of Truth)
        ↓
  hosts-manager.html (Web Tool)
        ↓
   ┌────────────┴────────────┐
   ↓                         ↓
dnsmasq-ads-filter-list.txt  xiaomi-router-hosts-noad.txt
```

## Contribution

1. Edit `raw-domains.txt` to add/remove domains
2. Open `hosts-manager.html` to generate updated files
3. Submit Pull Request

## License

MIT License

---

[中文版本](README_CN.md)

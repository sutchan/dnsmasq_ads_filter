# dnsmasq_ads_filter

[![English](https://img.shields.io/badge/language-English-blue)](README.md) [![中文](https://img.shields.io/badge/language-中文-red)](README.zh-CN.md) [![Version](https://img.shields.io/badge/version-1.0.2-green)](https://github.com/sutchan/dnsmasq_ads_filter)

Router-level ad blocking filter list for Xiaomi devices (TV, Box, Phone) using dnsmasq.

## Overview

This project provides a dnsmasq-based ad blocking list optimized for Xiaomi ecosystem devices. It blocks ads at the DNS level, providing a router-wide ad filtering solution.

## Usage

### Merlin Firmware (ASUS routers with Merlin)

**Path 1:** Software Center → DNS Settings → Custom dnsmasq

**Path 2:** Optional Internet → Custom dnsmasq

Copy all content from `dnsmasq.conf` and paste into the custom dnsmasq configuration.

### Xiaomi Router

Import `hosts.txt` into your Xiaomi router's ad blocking settings.

### OpenWrt

```bash
curl -sL https://raw.githubusercontent.com/sutchan/dnsmasq_ads_filter/main/dnsmasq.conf >> /etc/dnsmasq.conf
```

## Files

| File | Description |
|------|-------------|
| `dnsmasq.conf` | Main dnsmasq filter list (`address=/domain/0.0.0.0` format) |
| `hosts.txt` | Hosts file for Xiaomi router (`0.0.0.0 domain` format) |
| `manager.html` | Web interface for managing and generating filter lists |
| `domains.txt` | Unified domain list (one domain per line, source of truth) |

## Web Manager

Open `manager.html` in your browser to:

- Load and parse domain lists from URL or local file
- Choose preset sources (AdGuard, EasyList, NeoHosts, Xiaomi)
- Generate Dnsmasq or Hosts format output
- Configure IP addresses (IPv4/IPv6)
- Auto deduplicate and sort domains
- Download generated files

## Single Source Workflow

```
domains.txt (Source of Truth)
        ↓
    manager.html (Web Tool)
        ↓
   ┌────────────┴────────────┐
   ↓                         ↓
dnsmasq.conf              hosts.txt
```

## Contribution

1. Edit `domains.txt` to add/remove domains
2. Open `manager.html` to generate updated files
3. Submit Pull Request

## License

MIT License

---

[中文版本](README.zh-CN.md)

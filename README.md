# dnsmasq_ads_filter

[![English](https://img.shields.io/badge/language-English-blue)](README.md) [![中文](https://img.shields.io/badge/language-中文-red)](README.zh-CN.md) [![Version](https://img.shields.io/badge/version-1.0.2-green)](https://github.com/sutchan/dnsmasq_ads_filter)

Router-level DNS-based ad blocking filter list with web management tool.

## Overview

This project provides a dnsmasq/hosts-based ad blocking solution that works at the DNS level. It includes:

- **356+ blocked domains** - Comprehensive ad and tracking domain filter
- **Web management tool** - Generate custom filter lists via browser
- **Multiple output formats** - Supports Dnsmasq and Hosts formats
- **Single source workflow** - One domain list generates all output formats
- **Router compatible** - Works with Merlin, OpenWrt, Xiaomi, ASUS, TP-Link, and more

## Usage

### Merlin Firmware (ASUS routers with Merlin)

**Path 1:** Software Center → DNS Settings → Custom dnsmasq

**Path 2:** Optional Internet → Custom dnsmasq

Copy all content from `dnsmasq.conf` and paste into the custom dnsmasq configuration.

### Xiaomi Router / Other Routers with Custom Hosts Support

Import `hosts.txt` into your router's ad blocking settings.
This method works for all routers that support custom hosts files (Xiaomi, OpenWrt, ASUS, TP-Link, etc.).

### OpenWrt

```bash
curl -sL https://raw.githubusercontent.com/sutchan/dnsmasq_ads_filter/main/dnsmasq.conf >> /etc/dnsmasq.conf
```

## Files

| File | Description |
|------|-------------|
| `dnsmasq.conf` | Main dnsmasq filter list (`address=/domain/0.0.0.0` format) |
| `hosts.txt` | Hosts file for routers (`0.0.0.0 domain` format) |
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

# dnsmasq_ads_filter

[![English](https://img.shields.io/badge/language-English-blue)](README.en.md) [![中文](https://img.shields.io/badge/language-中文-red)](README.md) [![Version](https://img.shields.io/badge/version-1.0.6-green)](https://github.com/sutchan/dnsmasq_ads_filter)

Router-level DNS-based ad blocking filter list with web management tool.

## Overview

This project provides a dnsmasq/hosts-based ad blocking solution that includes:

- **422+ blocked domains** - Local ad and tracking domain filter (can expand to 6766+ with preset sources)
- **Ad Blocking** - Filter mainstream ad domains, App ads, Web ads
- **Payment QR Code Blocking** - Block payment QR code redirect links (WeChat/Alipay)
- **Tracking Protection** - Block data collection and user tracking
- **Web management tool** - Generate custom filter lists via browser
- **Multiple output formats** - Supports Dnsmasq and Hosts formats
- **Single source workflow** - One domain list generates all output formats
- **Router compatible** - Works with Merlin, OpenWrt, Xiaomi, ASUS, TP-Link, and more

## Features

### Ad Blocking
- **Video Ads**: Ads from Youku, iQiyi, Tencent Video, etc.
- **App Ads**: In-app advertisements, push notifications
- **Web Ads**: Banner ads, pop-ups, affiliate ads
- **Targeted Ads**: Baidu, ByteDance ad delivery domains

### Payment QR Code Blocking (Core Feature)
- **WeChat Ads**: Search ads, WeChat Channels ads, Mini Program ads
- **QQ Ads**: QQ group ads, QQ Browser ads
- **Payment Redirects**: Block payment QR code intermediate redirect pages
- **Mini Program Ads**: WeChat Mini Program ads, QQ Mini Program ads

### Tracking Protection
- **Data Collection**: Block analytics, statistics, tracking domains
- **User Tracking**: Prevent behavioral analysis and interest-based tracking

## Usage

### Method 1: Dnsmasq Format

For routers that support custom dnsmasq configuration.

#### Merlin Firmware (ASUS routers with Merlin)

**Path:** Software Center → DNS Settings → Custom dnsmasq

Copy all content from `dnsmasq.conf` and paste into the custom dnsmasq configuration.

#### OpenWrt

```bash
curl -sL https://raw.githubusercontent.com/sutchan/dnsmasq_ads_filter/main/dnsmasq.conf >> /etc/dnsmasq.conf
```

### Method 2: Hosts Format

For routers that support custom hosts files.

#### Xiaomi Router

**Path:** Settings → Advertising Blocking → Custom hosts

Import `hosts.txt` into your router's ad blocking settings.

#### ASUS Router (Stock Firmware)

**Path:** Advanced Settings → LAN → DHCP Server → Custom hosts file

#### TP-Link Router

**Path:** Advanced → Network → Internet → Custom hosts

#### OpenWrt

```bash
# Method 1: Via LuCI
# Services → DNS and DHCP → Extra hosts fields

# Method 2: Via CLI
curl -sL https://raw.githubusercontent.com/sutchan/dnsmasq_ads_filter/main/hosts.txt >> /etc/hosts
```

#### Other Routers

Most routers with custom hosts support can use the same method:

1. Download `hosts.txt` from the repository
2. Access your router's admin panel
3. Navigate to DNS/hosts settings
4. Import the hosts file

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

## Domain Format Guide

| Format | Description | Example |
|--------|-------------|---------|
| Plain domain | Blacklist, block resolution | `ad.example.com` |
| `+` prefix | Whitelist, allow resolution | `+api.example.com` |
| `!` prefix | Comment domain | `!comment.example.com` |
| `@` prefix | Custom DNS target | `@example.com=127.0.0.1` |

## Contribution

1. Edit `domains.txt` to add/remove domains
2. Open `manager.html` to generate updated files
3. Submit Pull Request

## License

MIT License

---

[中文版本](README.md)

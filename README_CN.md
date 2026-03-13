# dnsmasq_ads_filter

[![English](https://img.shields.io/badge/language-English-blue)](README.md) [![中文](https://img.shields.io/badge/language-中文-red)](README_CN.md)

基于 dnsmasq 的广告过滤规则，用于在路由器级别屏蔽小米设备（电视盒子、手机）的广告。

## 简介

本项目提供基于 dnsmasq 的广告过滤列表，专为小米生态设备优化。通过 DNS 层面拦截广告，实现全路由器广告屏蔽。

## 使用方法

### 梅林固件（华硕路由器）

**路径 1:** 软件中心 → 科学上网 → DNS 设置 → 自定义 dnsmasq

**路径 2:** 可选上网 → 自定义 dnsmasq

复制 `dnsmasq-ads-filter-list.txt` 的全部内容，粘贴到自定义 dnsmasq 配置中。

### 小米路由器

将 `xiaomi-router-hosts-noad.txt` 导入小米路由器的广告屏蔽设置。

## 文件说明

| 文件 | 说明 |
|------|------|
| `dnsmasq-ads-filter-list.txt` | 主 dnsmasq 过滤列表 |
| `xiaomi-router-hosts-noad.txt` | 小米路由器 hosts 文件 |

## 贡献

请直接编辑 `dnsmasq-ads-filter-list.txt`，编辑完成后提交 Pull Request 更新列表。

## 许可证

MIT License

---

[English Version](README.md)

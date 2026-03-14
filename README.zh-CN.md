# dnsmasq_ads_filter

[![English](https://img.shields.io/badge/language-English-blue)](README.md) [![中文](https://img.shields.io/badge/language-中文-red)](README.zh-CN.md) [![Version](https://img.shields.io/badge/version-1.0.2-green)](https://github.com/sutchan/dnsmasq_ads_filter)

基于 DNS 的路由器广告过滤规则库，提供 Web 管理界面。

## 简介

本项目提供基于 dnsmasq/hosts 的广告过滤解决方案，包含：

- **356+ 拦截域名** - 全面的广告和追踪域名过滤
- **Web 管理工具** - 通过浏览器生成自定义过滤清单
- **多种输出格式** - 支持 Dnsmasq 和 Hosts 格式
- **单一数据源工作流** - 一个域名清单生成所有输出格式
- **路由器兼容** - 支持梅林、OpenWrt、小米、华硕、TP-Link 等

## 使用方法

### 梅林固件（华硕路由器）

**路径 1:** 软件中心 → DNS 设置 → 自定义 dnsmasq

**路径 2:** 可选上网 → 自定义 dnsmasq

复制 `dnsmasq.conf` 的全部内容，粘贴到自定义 dnsmasq 配置中。

### 小米路由器/其他支持自定义 hosts 的路由器

将 `hosts.txt` 导入路由器的广告屏蔽设置。此方法适用于所有支持自定义 hosts 文件的路由器（小米、OpenWrt、华硕、TP-Link 等）。

### OpenWrt

```bash
curl -sL https://raw.githubusercontent.com/sutchan/dnsmasq_ads_filter/main/dnsmasq.conf >> /etc/dnsmasq.conf
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `dnsmasq.conf` | 主 dnsmasq 过滤列表（`address=/domain/0.0.0.0` 格式） |
| `hosts.txt` | 小米路由器 hosts 文件（`0.0.0.0 domain` 格式） |
| `manager.html` | Web 管理界面，用于管理和生成过滤清单 |
| `domains.txt` | 统一域名列表（每行一个域名，数据源） |

## Web 管理界面

在浏览器中打开 `manager.html` 可以：

- 从 URL 或本地文件加载域名列表
- 选择预设源（AdGuard、EasyList、NeoHosts、小米广告）
- 生成 Dnsmasq 或 Hosts 格式输出
- 配置 IP 地址（IPv4/IPv6）
- 自动去重和排序域名
- 下载生成的文件

## 单一数据源工作流

```
domains.txt (唯一数据源)
        ↓
  manager.html (Web 工具)
        ↓
   ┌────────────┴────────────┐
   ↓                         ↓
dnsmasq.conf              hosts.txt
```

## 贡献

1. 编辑 `domains.txt` 添加或删除域名
2. 打开 `manager.html` 生成更新的文件
3. 提交 Pull Request

## 许可证

MIT License

---

[English Version](README.md)

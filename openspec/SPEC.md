# 项目管理规范

## 1. 项目概述

- **项目名称**: dnsmasq_ads_filter
- **项目类型**: 广告过滤规则库
- **核心功能**: 基于 dnsmasq 的广告过滤规则，用于路由器级别屏蔽广告
- **目标用户**: 使用梅林固件/小米路由器/OpenWrt 的用户
- **项目地址**: https://github.com/sutchan/dnsmasq_ads_filter

## 2. 文件结构

```
dnsmasq_ads_filter/
├── README.md                           # 英文说明文档
├── README_CN.md                        # 中文说明文档
├── raw-domains.txt                     # 原始域名清单（唯一数据源）
├── dnsmasq-ads-filter-list.txt         # Dnsmasq 过滤列表（生成）
├── xiaomi-router-hosts-noad.txt         # 小米路由器 hosts 文件（生成）
├── hosts-manager.html                   # Web 管理界面
├── .gitignore                          # Git 忽略配置
└── openspec/                           # 项目规范文档
    ├── SPEC.md                          # 项目规范
    ├── TASKS.md                         # 任务清单
    └── CHECKLIST.md                     # 质量检查清单
```

## 3. 核心工作流程

### 3.1 单一数据源原则

```
raw-domains.txt (唯一数据源)
        ↓
  hosts-manager.html (Web 管理工具)
        ↓
   ┌────────────┴────────────┐
   ↓                         ↓
dnsmasq-ads-filter-list.txt  xiaomi-router-hosts-noad.txt
(Dnsmasq 格式)              (Hosts 格式)
```

### 3.2 原始域名格式 (raw-domains.txt)

- 每行一个域名
- `#` 开头为注释
- 支持通配符格式 `*.example.com`

**示例**:
```
# 小米广告域名
ad.mi.com
analytics.mi.com

# 通用广告域名
doubleclick.net
```

### 3.3 Dnsmasq 格式 (dnsmasq-ads-filter-list.txt)

```
address=/域名/IP
```

**示例**:
```
address=/ad.mi.com/0.0.0.0
address=/ad.mi.com/::
```

### 3.4 Hosts 格式 (xiaomi-router-hosts-noad.txt)

```
IP 域名
```

**示例**:
```
0.0.0.0 ad.mi.com
:: ad.mi.com
```

## 4. Web 管理工具 (hosts-manager.html)

### 4.1 功能特性

| 功能 | 说明 |
|------|------|
| URL 导入 | 从远程 URL 获取域名列表 |
| 预设源 | AdGuard、EasyList、NeoHosts、小米广告 |
| 手动编辑 | 直接在文本框编辑域名 |
| 格式生成 | Dnsmasq / Hosts / 混合输出 |
| IPv6 阻止 | 可选阻止 IPv6 广告 |
| 自动去重 | 合并重复域名 |
| 通配符处理 | 自动移除 `*.` 前缀 |
| 头部注释 | 生成包含项目信息的文件头 |
| 一键下载 | 下载生成的文件 |
| 剪贴板复制 | 复制生成的内容 |

### 4.2 设置选项

**生成设置**:
- 项目名称 (默认: `dnsmasq_ads_filter`)
- 版本号 (默认: `1.0.0`)
- IPv4 目标 IP (默认: `0.0.0.0`)
- IPv6 目标 IP (默认: `::`)
- Dnsmasq 文件名 (默认: `dnsmasq-ads-filter-list.txt`)
- Hosts 文件名 (默认: `xiaomi-router-hosts-noad.txt`)

**选项开关**:
- [x] 添加头部注释
- [x] 阻止 IPv6
- [x] 自动去重
- [x] 移除通配符前缀

### 4.3 使用流程

1. 打开 `hosts-manager.html`
2. 选择输入方式:
   - 从 URL 导入
   - 选择预设源
   - 直接编辑域名
3. 配置生成选项
4. 点击"生成规则"
5. 预览结果或直接下载

### 4.4 头部注释格式

生成的清单文件包含以下头部信息:

```
# ===============================================
# {projectName} - Dnsmasq Ad Block List
# ===============================================
#
# Description: Router-level ad blocking filter
#
# Version: {version}
# Update: {date}
# Domains: {count} unique domains
#
# Usage:
#   - Merlin: Software Center -> DNS Settings
#   - OpenWrt: Services -> DHCP and DNS
#
# Project: {projectUrl}
#
# ===============================================
```

## 5. 维护流程

### 5.1 新增规则

1. 编辑 `raw-domains.txt`，添加新域名
2. 打开 `hosts-manager.html`
3. 自动加载 `raw-domains.txt` 或手动输入
4. 配置输出选项
5. 点击"生成规则"
6. 下载更新后的文件

### 5.2 同步更新

1. 访问公开域名列表 URL
2. 导入到管理工具
3. 合并去重
4. 下载更新后的文件

### 5.3 更新周期

- 建议每2周检查一次规则有效性
- 重要广告域名应及时更新

## 6. Git 提交规范

```
feat: 添加xx域名过滤
fix: 修复xx规则
docs: 更新README
chore: 更新web管理工具
refactor: 优化规则生成逻辑
```

## 7. 测试验证

### 7.1 梅林固件测试

1. 登录路由器后台
2. 进入软件中心 → 科学上网 → DNS设置
3. 粘贴过滤规则
4. 重启 dnsmasq 服务
5. 测试目标广告是否被拦截

### 7.2 小米路由器测试

1. 登录小米路由器管理后台
2. 进入广告拦截设置
3. 导入 hosts 文件
4. 重启网络服务
5. 验证广告拦截效果

### 7.3 OpenWrt 测试

1. 登录 OpenWrt 后台
2. 进入服务 → DHCP 和 DNS
3. 在 Resolvfile 中添加规则
4. 重启 DNS 服务
5. 验证广告拦截效果

## 8. 版本管理

使用 SemVer 格式: `v1.0.0`

| 版本类型 | 说明 |
|----------|------|
| 主版本号 | 重大规则变更/格式变化 |
| 次版本号 | 新增功能/规则 |
| 修订号 | 规则修正/优化 |

## 9. 依赖关系

```
hosts-manager.html (纯静态，无需服务器)
    │
    ├── raw-domains.txt (数据源)
    │
    └── 预设源 URL
        ├── AdGuard DNS Filter
        ├── EasyList
        ├── NeoHosts
        └── (本地文件)
```

## 10. 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 11. 已知限制

- 部分广告域名可能使用 HTTPS 硬编码，需配合 Pi-hole 或广告屏蔽插件
- 部分设备可能有 hosts 文件大小限制
- 需要定期更新规则以应对新广告形式

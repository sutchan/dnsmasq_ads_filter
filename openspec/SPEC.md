# 项目管理规范

## 1. 项目概述

- **项目名称**: dnsmasq_ads_filter
- **项目类型**: 广告过滤规则库
- **核心功能**: 基于 dnsmasq 的广告过滤规则，用于路由器级别屏蔽小米设备广告
- **目标用户**: 使用梅林固件/小米路由器的用户

## 2. 文件结构

```
dnsmasq_ads_filter/
├── README.md                    # 英文说明文档
├── README_CN.md                 # 中文说明文档
├── raw-domains.txt              # 原始域名清单（唯一数据源）
├── dnsmasq-ads-filter-list.txt # Dnsmasq 过滤列表（生成）
├── xiaomi-router-hosts-noad.txt # 小米路由器 hosts 文件（生成）
├── hosts-manager.html            # Web 管理界面
├── .gitignore                   # Git 忽略配置
└── openspec/                    # 项目规范文档
```

## 3. 核心工作流程

### 3.1 单一数据源原则

- **唯一数据源**: `raw-domains.txt` 是所有过滤规则的唯一来源
- **自动生成**: 通过 `hosts-manager.html` 生成其他格式

### 3.2 原始域名格式 (raw-domains.txt)

```
# 注释说明
域名
```

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
# update date: 2026.03.13
address=/域名/0.0.0.0
address=/域名::/
```

### 3.4 Hosts 格式 (xiaomi-router-hosts-noad.txt)

```
# update date: 2026.03.13
0.0.0.0 域名
:: 域名
```

## 4. Web 管理工具 (hosts-manager.html)

### 功能特性
- 从 URL 导入域名列表
- 预设源：AdGuard、EasyList、NeoHosts
- 直接编辑域名
- 生成 Dnsmasq / Hosts 格式
- 支持 IPv6 阻止
- 一键下载生成文件
- 复制到剪贴板

### 使用流程
1. 打开 `hosts-manager.html`
2. 输入/导入域名到源文本框
3. 选择输出格式（Dnsmasq/Hosts/混合）
4. 点击"生成规则"
5. 下载或复制结果

## 5. 维护流程

### 5.1 新增规则
1. 编辑 `raw-domains.txt`，添加新域名
2. 打开 `hosts-manager.html`
3. 点击"选择预设源"中的"小米广告"加载现有规则
4. 或直接在文本框编辑域名
5. 生成并下载新的过滤文件

### 5.2 同步更新
1. 访问公开域名列表 URL
2. 导入到管理工具
3. 合并去重
4. 下载更新后的文件

### 5.3 更新周期
- 建议每2周检查一次规则有效性
- 重要广告域名应及时更新

## 6. Git 提交规范

- `feat: 添加xx域名过滤`
- `fix: 修复xx规则`
- `docs: 更新README`
- `chore: 更新web管理工具`

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

## 8. 版本管理

使用 SemVer 格式: `v1.0.0`

- 主版本号: 重大规则变更
- 次版本号: 新增功能/规则
- 修订号: 规则修正/优化

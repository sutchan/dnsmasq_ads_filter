<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>dnsmasq_ads_filter</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 { border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        h2 { color: #667eea; margin-top: 30px; }
        h3 { color: #764ba2; }
        a { color: #667eea; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 6px; overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #667eea; color: white; }
        .lang-tabs { margin-bottom: 20px; }
        .lang-btn {
            padding: 8px 20px;
            margin-right: 10px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }
        .lang-btn.active {
            background: #667eea;
            color: white;
        }
        .lang-btn:hover:not(.active) {
            background: #f0f0ff;
        }
        .content-section { display: none; }
        .content-section.active { display: block; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; margin-right: 5px; }
        .badge-en { background: #dbeafe; color: #1e40af; }
        .badge-cn { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="lang-tabs">
        <button class="lang-btn active" onclick="switchLang('en')">🇺🇸 English</button>
        <button class="lang-btn" onclick="switchLang('zh')">🇨🇳 中文</button>
    </div>

    <div id="content-en" class="content-section active">
        <h1>dnsmasq_ads_filter</h1>
        
        <p>Router-level ad blocking filter list for Xiaomi devices (TV, Box, Phone) using dnsmasq.</p>

        <h2>Overview</h2>
        <p>This project provides a dnsmasq-based ad blocking list optimized for Xiaomi ecosystem devices. It blocks ads at the DNS level, providing a router-wide ad filtering solution.</p>

        <h2>Usage</h2>
        
        <h3>Merlin Firmware (ASUS routers with Merlin)</h3>
        <p><strong>Path 1:</strong> Software Center →科学上网 → DNS Settings → Custom dnsmasq</p>
        <p><strong>Path 2:</strong> Optional Internet → Custom dnsmasq</p>
        <p>Copy all content from <code>dnsmasq-ads-filter-list.txt</code> and paste into the custom dnsmasq configuration.</p>

        <h3>Xiaomi Router</h3>
        <p>Import <code>xiaomi-router-hosts-noad.txt</code> into your Xiaomi router's ad blocking settings.</p>

        <h3>OpenWrt</h3>
        <pre>curl -sL https://raw.githubusercontent.com/sutchan/dnsmasq_ads_filter/main/dnsmasq-ads-filter-list.txt >> /etc/dnsmasq.conf</pre>

        <h2>Files</h2>
        <table>
            <tr>
                <th>File</th>
                <th>Description</th>
            </tr>
            <tr>
                <td><code>dnsmasq-ads-filter-list.txt</code></td>
                <td>Main dnsmasq filter list (address=/domain/127.0.0.1 format)</td>
            </tr>
            <tr>
                <td><code>xiaomi-router-hosts-noad.txt</code></td>
                <td>Xiaomi router hosts file (127.0.0.1 domain format)</td>
            </tr>
            <tr>
                <td><code>hosts-manager.html</code></td>
                <td>Web interface for managing and syncing both filter lists</td>
            </tr>
            <tr>
                <td><code>raw-domains.txt</code></td>
                <td>Unified domain list (one domain per line, source of truth)</td>
            </tr>
        </table>

        <h2>Web Manager</h2>
        <p>Open <code>hosts-manager.html</code> in your browser to:</p>
        <ul>
            <li>Load and compare both filter lists</li>
            <li>View domain differences (only in Dnsmasq, only in Xiaomi, common)</li>
            <li>Sync domains between the two formats</li>
            <li>Merge both lists into one</li>
        </ul>

        <h2>Contribution</h2>
        <p>Edit <code>raw-domains.txt</code> to add/remove domains, then run the sync tool to regenerate both format files.</p>

        <h2>License</h2>
        <p>MIT License</p>
    </div>

    <div id="content-zh" class="content-section">
        <h1>dnsmasq_ads_filter</h1>
        
        <p>基于 dnsmasq 的广告过滤规则，用于在路由器级别屏蔽小米设备（电视盒子、手机）的广告。</p>

        <h2>简介</h2>
        <p>本项目提供基于 dnsmasq 的广告过滤列表，专为小米生态设备优化。通过 DNS 层面拦截广告，实现全路由器广告屏蔽。</p>

        <h2>使用方法</h2>
        
        <h3>梅林固件（华硕路由器）</h3>
        <p><strong>路径 1:</strong> 软件中心 → 科学上网 → DNS 设置 → 自定义 dnsmasq</p>
        <p><strong>路径 2:</strong> 可选上网 → 自定义 dnsmasq</p>
        <p>复制 <code>dnsmasq-ads-filter-list.txt</code> 的全部内容，粘贴到自定义 dnsmasq 配置中。</p>

        <h3>小米路由器</h3>
        <p>将 <code>xiaomi-router-hosts-noad.txt</code> 导入小米路由器的广告屏蔽设置。</p>

        <h3>OpenWrt</h3>
        <pre>curl -sL https://raw.githubusercontent.com/sutchan/dnsmasq_ads_filter/main/dnsmasq-ads-filter-list.txt >> /etc/dnsmasq.conf</pre>

        <h2>文件说明</h2>
        <table>
            <tr>
                <th>文件</th>
                <th>说明</th>
            </tr>
            <tr>
                <td><code>dnsmasq-ads-filter-list.txt</code></td>
                <td>主 dnsmasq 过滤列表（address=/domain/127.0.0.1 格式）</td>
            </tr>
            <tr>
                <td><code>xiaomi-router-hosts-noad.txt</code></td>
                <td>小米路由器 hosts 文件（127.0.0.1 domain 格式）</td>
            </tr>
            <tr>
                <td><code>hosts-manager.html</code></td>
                <td>Web 管理界面，用于管理和同步两份过滤清单</td>
            </tr>
            <tr>
                <td><code>raw-domains.txt</code></td>
                <td>统一域名列表（每行一个域名，数据源）</td>
            </tr>
        </table>

        <h2>Web 管理界面</h2>
        <p>在浏览器中打开 <code>hosts-manager.html</code> 可以：</p>
        <ul>
            <li>加载并对比两份过滤清单</li>
            <li>查看域名差异（仅在Dnsmasq、仅在小米、共同域名）</li>
            <li>在两种格式之间同步域名</li>
            <li>合并两份清单</li>
        </ul>

        <h2>贡献</h2>
        <p>请编辑 <code>raw-domains.txt</code> 添加或删除域名，然后运行同步工具重新生成两种格式的文件。</p>

        <h2>许可证</h2>
        <p>MIT License</p>
    </div>

    <div class="footer">
        <p>MIT License</p>
    </div>

    <script>
        function switchLang(lang) {
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            
            if (lang === 'en') {
                document.querySelector('.lang-btn:nth-child(1)').classList.add('active');
                document.getElementById('content-en').classList.add('active');
                document.documentElement.lang = 'en';
            } else {
                document.querySelector('.lang-btn:nth-child(2)').classList.add('active');
                document.getElementById('content-zh').classList.add('active');
                document.documentElement.lang = 'zh-CN';
            }
            
            localStorage.setItem('preferredLang', lang);
        }
        
        const savedLang = localStorage.getItem('preferredLang') || 'zh';
        switchLang(savedLang);
    </script>
</body>
</html>

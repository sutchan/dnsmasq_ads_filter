let domains = [];
let urlList = [];
let whitelist = [];
let customDns = [];
let currentFormat = 'dnsmasq';
let outputContent = { dnsmasq: '', hosts: '' };
let isLangZh = true;

const debouncedParse = debounce(() => parseSource(), 300);
const debouncedGenerate = debounce(() => generateRules(), 300);

const projectUrl = 'https://github.com/sutchan/dnsmasq_ads_filter';

let settings = {
    projectName: 'dnsmasq_ads_filter',
    version: '1.0.2',
    ipv4: '0.0.0.0',
    ipv6: '::',
    dnsmasqFilename: 'dnsmasq.conf',
    hostsFilename: 'hosts.txt'
};

const presets = {
    adguard: 'https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt',
    easylist: 'https://easylist.to/easylist/easylist.txt',
    xiaomi: '',
    neohosts: 'https://raw.githubusercontent.com/neo-forte/neo-forte.github.io/main/hosts/AdGameHosts/hosts'
};

let translations = getTranslations();

function setFormat(format) {
    currentFormat = format;
    document.querySelectorAll('.format-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.format-tab[onclick="setFormat('${format}')"]`).classList.add('active');
    if (domains.length > 0) generateRules();
}

function addUrl() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        showToast(t('toastInvalidUrl'), true);
        return;
    }

    if (!isValidUrl(url)) {
        showToast(t('toastInvalidUrl'), true);
        return;
    }

    if (urlList.some(u => u.url === url)) {
        showToast(t('toastUrlExists'), true);
        return;
    }

    urlList.push({ url, status: 'pending' });
    renderUrlList();
    saveUrlList();
}

function removeUrl(index) {
    urlList.splice(index, 1);
    renderUrlList();
    saveUrlList();
}

function renderUrlList() {
    const container = document.getElementById('urlList');
    container.innerHTML = urlList.map((item, index) => `
        <div class="url-item ${item.status}">
            <span class="url-text" title="${item.url}">${item.url}</span>
            <span class="url-remove" onclick="removeUrl(${index})">✕</span>
        </div>
    `).join('');
}

function validateUrl(url) {
    return new Promise((resolve) => {
        fetch(url, { method: 'HEAD' })
            .then(response => {
                resolve({
                    valid: response.ok,
                    status: response.status,
                    contentType: response.headers.get('content-type')
                });
            })
            .catch(() => resolve({ valid: false, status: 0 }));
    });
}

async function validateAllUrls() {
    for (let i = 0; i < urlList.length; i++) {
        const item = urlList[i];
        item.status = 'loading';
        renderUrlList();

        const result = await validateUrl(item.url);

        if (result.valid) {
            item.status = 'success';
            item.valid = true;
        } else {
            item.status = 'error';
            item.valid = false;
        }

        renderUrlList();
    }

    saveUrlList();
    showToast(t('toastValidated'));
}

async function fetchAllUrls() {
    const validUrls = urlList.filter(u => u.valid !== false);

    if (validUrls.length === 0) {
        showToast(t('toastNoValidUrls'), true);
        return;
    }

    let allContent = [];

    for (const item of validUrls) {
        try {
            showToast(t('toastFetching') + ' ' + item.url);
            const response = await fetch(item.url);
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const content = await response.text();
            allContent.push(content);
        } catch (e) {
            showToast(t('toastFetchFailed') + item.url, true);
        }
    }

    if (allContent.length > 0) {
        document.getElementById('sourceInput').value = allContent.join('\n');
        parseSource();
        showToast(t('toastFetchSuccess') + ` (${allContent.length} ${t('toastFiles')})`);
    }
}

function saveUrlList() {
    localStorage.setItem('urlList', JSON.stringify(urlList));
}

function loadUrlList() {
    const saved = localStorage.getItem('urlList');
    if (saved) {
        try {
            urlList = JSON.parse(saved);
            renderUrlList();
        } catch (e) {
            urlList = [];
        }
    }
}

async function fetchFromUrl() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        showToast('请输入有效的 URL', true);
        return;
    }

    try {
        showToast(t('toastFetching'));
        const response = await fetch(url);
        if (!response.ok) throw new Error(t('toastFetchFailed'));
        const content = await response.text();
        document.getElementById('sourceInput').value = content;
        parseSource();
        showToast(t('toastFetchSuccess'));
    } catch (e) {
        showToast(t('toastFetchFailed') + e.message, true);
    }
}

function loadPreset(name, evt) {
    const presetUrls = {
        'adguard': 'https://raw.githubusercontent.com/AdAway/adaway.github.io/master/hosts.txt',
        'easylist': 'https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_adservers.txt',
        'xiaomi': 'dnsmasq.conf',
        'neohosts': 'https://raw.githubusercontent.com/neoHosts/neoHosts/master/data/hosts/basic'
    };

    const url = presetUrls[name];
    if (url) {
        document.getElementById('urlInput').value = url;
        fetchFromUrl();
    } else {
        if (name === 'xiaomi') {
            fetch('dnsmasq.conf').then(r => r.text()).then(t => {
                document.getElementById('sourceInput').value = t;
                parseSource();
            }).catch(() => {
                showToast(t('toastPresetFailed'), true);
            });
        }
    }

    document.querySelectorAll('.preset-tag').forEach(t => t.classList.remove('active'));
    if (evt && evt.target) evt.target.classList.add('active');

    showToast(t('toastLoadPreset'));
}

function handleSourceInput() {
    parseSource();
    updateLineNumbers();
}

function updateLineNumbers() {
    const textarea = document.getElementById('sourceInput');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = textarea.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
}

function parseSource() {
    const content = document.getElementById('sourceInput').value;
    const lines = content.split('\n');

    domains = [];
    whitelist = [];
    customDns = [];
    let commentCount = 0;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('#')) {
            commentCount++;
            continue;
        }

        let domain = trimmed;

        if (trimmed.startsWith('0.0.0.0 ') || trimmed.startsWith('127.0.0.1 ')) {
            domain = trimmed.replace(/^(0\.0\.0\.0|127\.0\.0\.1)\s+/, '');
        }

        if (trimmed.startsWith('address=/')) {
            const match = trimmed.match(/address=\/([^\/]+)\//);
            if (match) domain = match[1];
        }

        if (trimmed.startsWith('+')) {
            domain = trimmed.substring(1).trim().toLowerCase().replace(/^\*\./, '');
            if (domain && isValidDomain(domain)) {
                whitelist.push(domain);
            }
            continue;
        }

        if (trimmed.startsWith('!')) {
            domain = trimmed.substring(1).trim().split('#')[0].trim().toLowerCase().replace(/^\*\./, '');
            if (domain && isValidDomain(domain)) {
                domains.push(domain);
                commentCount++;
            }
            continue;
        }

        if (trimmed.startsWith('@')) {
            const match = trimmed.substring(1).trim().match(/^([^=]+)=(.+)$/);
            if (match) {
                const dnsDomain = match[1].toLowerCase().replace(/^\*\./, '');
                const dnsIp = match[2].trim();
                if (dnsDomain && isValidDomain(dnsDomain)) {
                    customDns.push({ domain: dnsDomain, ip: dnsIp });
                }
            }
            continue;
        }

        domain = domain.toLowerCase().replace(/^\*\./, '');

        if (domain && isValidDomain(domain)) {
            domains.push(domain);
        }
    }

    document.getElementById('domainCount').textContent = domains.length + commentCount;
    document.getElementById('validCount').textContent = domains.length;
    document.getElementById('commentCount').textContent = commentCount;

    if (domains.length > 0 || whitelist.length > 0 || customDns.length > 0) {
        generateRules();
    }
}

function updateSettings() {
    settings.projectName = document.getElementById('projectNameInput').value || 'ad_block_list';
    settings.version = document.getElementById('versionInput').value || '1.0.0';
    settings.ipv4 = document.getElementById('ipv4Input').value || '0.0.0.0';
    settings.ipv6 = document.getElementById('ipv6Input').value || '::';
    settings.dnsmasqFilename = document.getElementById('dnsmasqFilename').value || 'dnsmasq.conf';
    settings.hostsFilename = document.getElementById('hostsFilename').value || 'hosts.txt';
    if (domains.length > 0) generateRules();
}

function generateRules() {
    const addHeader = document.getElementById('addHeader').checked;
    const blockIPv6 = document.getElementById('blockIPv6').checked;
    const dedupDomains = document.getElementById('dedupDomains').checked;
    const removeWildcard = document.getElementById('removeWildcard').checked;

    let processedDomains = [...domains];
    if (removeWildcard) {
        processedDomains = processedDomains.map(d => d.replace(/^\*\./, ''));
    }
    if (dedupDomains) {
        processedDomains = [...new Set(processedDomains)].sort();
    }

    let processedWhitelist = [...whitelist];
    if (removeWildcard) {
        processedWhitelist = processedWhitelist.map(d => d.replace(/^\*\./, ''));
    }
    if (dedupDomains) {
        processedWhitelist = [...new Set(processedWhitelist)].sort();
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;

    let dnsmasqContent = '';
    let hostsContent = '';

    if (addHeader) {
        const totalDomains = processedDomains.length + customDns.length;
        dnsmasqContent += `# ===============================================\n`;
        dnsmasqContent += `# ${settings.projectName} - Dnsmasq Ad Block List\n`;
        dnsmasqContent += `# ===============================================\n`;
        dnsmasqContent += `#\n`;
        dnsmasqContent += `# Description: Router-level ad blocking filter\n`;
        dnsmasqContent += `#\n`;
        dnsmasqContent += `# Version: ${settings.version}\n`;
        dnsmasqContent += `# Update: ${dateStr}\n`;
        dnsmasqContent += `# Domains: ${totalDomains} unique domains\n`;
        if (processedWhitelist.length > 0) {
            dnsmasqContent += `# Whitelist: ${processedWhitelist.length} domains\n`;
        }
        dnsmasqContent += `#\n`;
        dnsmasqContent += `# Usage:\n`;
        dnsmasqContent += `#   - Merlin: Software Center -> DNS Settings\n`;
        dnsmasqContent += `#   - OpenWrt: Services -> DHCP and DNS\n`;
        dnsmasqContent += `#\n`;
        dnsmasqContent += `# Project: ${projectUrl}\n`;
        dnsmasqContent += `#\n`;
        dnsmasqContent += `# ===============================================\n\n`;

        hostsContent += `# ===============================================\n`;
        hostsContent += `# ${settings.projectName} - Xiaomi Router Hosts Block List\n`;
        hostsContent += `# ===============================================\n`;
        hostsContent += `#\n`;
        hostsContent += `# Description: Router-level ad blocking hosts file\n`;
        hostsContent += `#\n`;
        hostsContent += `# Version: ${settings.version}\n`;
        hostsContent += `# Update: ${dateStr}\n`;
        hostsContent += `# Domains: ${totalDomains} unique domains\n`;
        if (processedWhitelist.length > 0) {
            hostsContent += `# Whitelist: ${processedWhitelist.length} domains\n`;
        }
        hostsContent += `#\n`;
        hostsContent += `# Usage: Import to Xiaomi router ad blocking settings\n`;
        hostsContent += `#\n`;
        hostsContent += `# Project: ${projectUrl}\n`;
        hostsContent += `#\n`;
        hostsContent += `# ===============================================\n\n`;
    }

    processedDomains.forEach(domain => {
        dnsmasqContent += `address=/${domain}/${settings.ipv4}\n`;
        hostsContent += `${settings.ipv4} ${domain}\n`;

        if (blockIPv6) {
            dnsmasqContent += `address=/${domain}/${settings.ipv6}\n`;
            hostsContent += `${settings.ipv6} ${domain}\n`;
        }
    });

    customDns.forEach(item => {
        dnsmasqContent += `address=/${item.domain}/${item.ip}\n`;
        hostsContent += `${item.ip} ${item.domain}\n`;

        if (blockIPv6) {
            dnsmasqContent += `address=/${item.domain}/::\n`;
        }
    });

    if (processedWhitelist.length > 0) {
        if (addHeader) {
            dnsmasqContent += `\n# Whitelist (allow these domains)\n`;
            hostsContent += `\n# Whitelist (allow these domains)\n`;
        }
        processedWhitelist.forEach(domain => {
            dnsmasqContent += `server=/${domain}/\n`;
            hostsContent += `# Whitelisted: ${domain}\n`;
        });
    }

    outputContent.dnsmasq = dnsmasqContent;
    outputContent.hosts = hostsContent;

    let preview = '';
    if (currentFormat === 'dnsmasq') {
        preview = dnsmasqContent;
    } else if (currentFormat === 'hosts') {
        preview = hostsContent;
    } else {
        preview = '=== Dnsmasq 格式 ===\n' + dnsmasqContent + '\n\n=== Hosts 格式 ===\n' + hostsContent;
    }

    document.getElementById('outputPreview').textContent = preview;
    document.getElementById('mergeInfo').textContent = `黑名单: ${processedDomains.length} | 白名单: ${processedWhitelist.length} | 自定义DNS: ${customDns.length} | Dnsmasq: ${dnsmasqContent.split('\n').length} 行 | Hosts: ${hostsContent.split('\n').length} 行`;
}

function downloadOutput() {
    const format = currentFormat;
    if (format === 'dnsmasq') {
        downloadFile(outputContent.dnsmasq, settings.dnsmasqFilename);
    } else if (format === 'hosts') {
        downloadFile(outputContent.hosts, settings.hostsFilename);
    } else {
        downloadFile(outputContent.dnsmasq, settings.dnsmasqFilename);
        setTimeout(() => downloadFile(outputContent.hosts, settings.hostsFilename), 500);
    }
}

function downloadDnsmasq() {
    if (!outputContent.dnsmasq) generateRules();
    downloadFile(outputContent.dnsmasq, settings.dnsmasqFilename);
    showToast('已下载 ' + settings.dnsmasqFilename);
}

function downloadHosts() {
    if (!outputContent.hosts) generateRules();
    downloadFile(outputContent.hosts, settings.hostsFilename);
    showToast('已下载 ' + settings.hostsFilename);
}

function copyOutput() {
    const format = currentFormat;
    let text = '';
    if (format === 'dnsmasq') text = outputContent.dnsmasq;
    else if (format === 'hosts') text = outputContent.hosts;
    else text = outputContent.dnsmasq + '\n\n' + outputContent.hosts;

    navigator.clipboard.writeText(text).then(() => {
        showToast(t('toastCopied'));
    }).catch(() => {
        showToast('复制失败', true);
    });
}

function sortDomains() {
    const textarea = document.getElementById('sourceInput');
    const lines = textarea.value.split('\n');
    const sortedLines = lines
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .sort((a, b) => {
            const aIsComment = a.startsWith('#');
            const bIsComment = b.startsWith('#');
            if (aIsComment && !bIsComment) return 1;
            if (!aIsComment && bIsComment) return -1;
            return a.localeCompare(b);
        });
    textarea.value = sortedLines.join('\n');
    parseSource();
    showToast(t('toastSorted'));
}

function clearAll() {
    document.getElementById('sourceInput').value = '';
    document.getElementById('urlInput').value = '';
    domains = [];
    whitelist = [];
    customDns = [];
    parseSource();
    document.getElementById('outputPreview').textContent = '// 生成的规则将显示在这里';
    document.getElementById('mergeInfo').textContent = translations.mergeInfo;
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        document.querySelector('.theme-btn').textContent = '🌙';
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.querySelector('.theme-btn').textContent = '☀️';
    }
}

function switchLang() {
    isLangZh = !isLangZh;
    localStorage.setItem('lang', isLangZh ? 'zh' : 'en');
    updateLang();
}

function updateLang() {
    const lang = localStorage.getItem('lang') || 'zh';
    translations = getTranslations();
    const trans = translations[lang] || translations.zh;

    document.querySelector('h1').textContent = trans.title;
    document.querySelector('.subtitle').textContent = trans.subtitle;
    document.querySelector('.lang-btn').textContent = trans.langBtn;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (trans[key]) {
            el.textContent = trans[key];
        }
    });
}

(function init() {
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-btn').textContent = '☀️';
    }

    isLangZh = localStorage.getItem('lang') !== 'en';
    updateLang();
    loadUrlList();

    fetch('domains.txt')
        .then(r => r.text())
        .then(t => {
            if (t.trim()) {
                document.getElementById('sourceInput').value = t;
                parseSource();
            }
        })
        .catch(() => {});
})();

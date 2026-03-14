// assets/js/ui.js v1.0.2
// UI interaction functions for DNS Ad Block List Generator

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

    document.querySelectorAll('.preset-tag').forEach(tag => tag.classList.remove('active'));
    if (evt && evt.target) evt.target.classList.add('active');

    showToast(t('toastLoadPreset'));
}

function handleSourceInput() {
    parseSource();
    updateLineNumbers();
    syncScroll();
}

function updateLineNumbers() {
    const textarea = document.getElementById('sourceInput');
    const lineNumbers = document.getElementById('lineNumbers');
    if (!textarea || !lineNumbers) return;
    
    const lines = textarea.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
}

function updateOutputLineNumbers() {
    const outputPreview = document.getElementById('outputPreview');
    const outputLineNumbers = document.getElementById('outputLineNumbers');
    if (!outputPreview || !outputLineNumbers) return;
    
    const lines = outputPreview.textContent.split('\n').length;
    outputLineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
}

function syncScroll() {
    const textarea = document.getElementById('sourceInput');
    const lineNumbers = document.getElementById('lineNumbers');
    if (!textarea || !lineNumbers) return;
    const scrollTop = textarea.scrollTop;
    const lineHeight = 19.5;
    lineNumbers.scrollTop = scrollTop;
    lineNumbers.style.transform = `translateY(-${scrollTop}px)`;
}

function syncOutputScroll() {
    const outputPreview = document.getElementById('outputPreview');
    const outputLineNumbers = document.getElementById('outputLineNumbers');
    if (!outputPreview || !outputLineNumbers) return;
    const scrollTop = outputPreview.scrollTop;
    outputLineNumbers.scrollTop = scrollTop;
    outputLineNumbers.style.transform = `translateY(-${scrollTop}px)`;
}

function clearAll() {
    document.getElementById('sourceInput').value = '';
    document.getElementById('urlInput').value = '';
    domains = [];
    whitelist = [];
    customDns = [];
    parseSource();
    document.getElementById('outputPreview').textContent = '// 生成的规则将显示在这里';
    updateOutputLineNumbers();
    document.getElementById('mergeInfo').textContent = getTranslations().mergeInfo;
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

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('collapsed');
    }
}

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    if (panel) {
        panel.classList.toggle('collapsed');
    }
}

function switchLang() {
    isLangZh = !isLangZh;
    localStorage.setItem('lang', isLangZh ? 'zh' : 'en');
    updateLang();
}

function updateLang() {
    const lang = localStorage.getItem('lang') || 'zh';
    const trans = getTranslations();

    document.querySelector('h1').textContent = trans.title;
    document.querySelector('.subtitle').textContent = trans.subtitle;

    const langSwitch = document.querySelector('.lang-switch');
    if (langSwitch) {
        if (lang === 'en') {
            langSwitch.classList.add('active');
            langSwitch.querySelector('.lang-zh').style.opacity = '0.6';
            langSwitch.querySelector('.lang-en').style.opacity = '1';
        } else {
            langSwitch.classList.remove('active');
            langSwitch.querySelector('.lang-zh').style.opacity = '1';
            langSwitch.querySelector('.lang-en').style.opacity = '0.6';
        }
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (trans[key]) {
            el.textContent = trans[key];
        }
    });

    const usageToggle = document.getElementById('usageToggle');
    const usageGuide = document.getElementById('usageGuide');
    const usageToggleText = document.getElementById('usageToggleText');
    if (usageToggle && usageGuide) {
        const isExpanded = usageGuide.classList.contains('visible');
        if (isExpanded) {
            usageToggleText.textContent = trans.usageTitle;
        }
    }
}

function toggleUsage() {
    const usageToggle = document.getElementById('usageToggle');
    const usageGuide = document.getElementById('usageGuide');
    const usageToggleText = document.getElementById('usageToggleText');
    const trans = getTranslations();

    if (!usageToggle || !usageGuide) return;

    usageToggle.classList.toggle('expanded');
    usageGuide.classList.toggle('visible');

    const isExpanded = usageGuide.classList.contains('visible');
    usageToggleText.textContent = trans.usageTitle;
}

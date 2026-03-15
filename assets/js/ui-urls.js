// assets/js/ui-urls.js v1.0.2
// URL management functions for DNS Ad Block List Generator

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
        'builtin': 'domains.txt',
        'neohosts': 'https://raw.githubusercontent.com/neoHosts/neoHosts/master/data/hosts/basic'
    };

    const url = presetUrls[name];
    if (url) {
        document.getElementById('urlInput').value = url;
        fetchFromUrl();
    } else {
        if (name === 'builtin') {
            fetch('domains.txt').then(r => r.text()).then(t => {
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

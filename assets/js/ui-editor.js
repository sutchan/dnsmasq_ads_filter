// assets/js/ui-editor.js v1.0.3
// Editor functions for DNS Ad Block List Generator

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
    const lineHeight = 19.5;
    let html = '';
    for (let i = 1; i <= lines; i++) {
        html += i + (i < lines ? '\n' : '');
    }
    lineNumbers.textContent = html;
    lineNumbers.style.lineHeight = lineHeight + 'px';
    lineNumbers.style.height = Math.max(lines * lineHeight, textarea.clientHeight) + 'px';
}

function updateOutputLineNumbers() {
    const outputPreview = document.getElementById('outputPreview');
    const outputLineNumbers = document.getElementById('outputLineNumbers');
    if (!outputPreview || !outputLineNumbers) return;
    
    const lines = outputPreview.textContent.split('\n').length;
    const lineHeight = 16.5;
    let html = '';
    for (let i = 1; i <= lines; i++) {
        html += i + (i < lines ? '\n' : '');
    }
    outputLineNumbers.textContent = html;
    outputLineNumbers.style.lineHeight = lineHeight + 'px';
    outputLineNumbers.style.height = Math.max(lines * lineHeight, outputPreview.clientHeight) + 'px';
}

function syncScroll() {
    const textarea = document.getElementById('sourceInput');
    const lineNumbers = document.getElementById('lineNumbers');
    if (!textarea || !lineNumbers) return;
    const scrollTop = textarea.scrollTop;
    lineNumbers.scrollTop = scrollTop;
}

function syncOutputScroll() {
    const outputPreview = document.getElementById('outputPreview');
    const outputLineNumbers = document.getElementById('outputLineNumbers');
    if (!outputPreview || !outputLineNumbers) return;
    const scrollTop = outputPreview.scrollTop;
    outputLineNumbers.scrollTop = scrollTop;
}

function clearAll() {
    document.getElementById('sourceInput').value = '';
    document.getElementById('urlInput').value = '';
    domains = [];
    whitelist = [];
    customDns = [];
    parseSource();
    updateLineNumbers();
    document.getElementById('outputPreview').textContent = '// 生成的规则将显示在这里';
    updateOutputLineNumbers();
    document.getElementById('mergeInfo').textContent = getTranslations().mergeInfo;
}

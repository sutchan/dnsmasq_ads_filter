// assets/js/ui-editor.js v1.0.2
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

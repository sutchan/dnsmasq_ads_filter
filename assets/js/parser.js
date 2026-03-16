// assets/js/parser.js v1.0.5
// Domain parsing logic for DNS Ad Block List Generator

function parseSource() {
    const content = document.getElementById('sourceInput').value;
    const lines = content.split('\n');

    domains = [];
    whitelist = [];
    customDns = [];
    let commentCount = 0;

    for (const line of lines) {
        let rawLine = line.trim();
        if (!rawLine) continue;

        const hashIndex = rawLine.indexOf('#');
        if (hashIndex > 0) {
            rawLine = rawLine.substring(0, hashIndex).trim();
        }
        if (!rawLine) continue;

        if (rawLine.startsWith('#')) {
            const commentContent = rawLine.substring(1).trim();
            if (commentContent && isValidDomain(commentContent)) {
                domains.push(commentContent.toLowerCase());
                commentCount++;
            }
            continue;
        }

        let domain = rawLine;

        if (rawLine.startsWith('0.0.0.0 ') || rawLine.startsWith('127.0.0.1 ')) {
            domain = rawLine.replace(/^(0\.0\.0\.0|127\.0\.0\.1)\s+/, '');
        }

        if (rawLine.startsWith('address=/')) {
            const match = rawLine.match(/address=\/([^\/]+)\//);
            if (match) domain = match[1];
        }

        if (rawLine.startsWith('+')) {
            domain = rawLine.substring(1).trim().toLowerCase().replace(/^\*\./, '');
            if (domain && isValidDomain(domain)) {
                whitelist.push(domain);
            }
            continue;
        }

        if (rawLine.startsWith('!')) {
            domain = rawLine.substring(1).trim().split('#')[0].trim().toLowerCase().replace(/^\*\./, '');
            if (domain && isValidDomain(domain)) {
                domains.push(domain);
                commentCount++;
            }
            continue;
        }

        if (rawLine.startsWith('@')) {
            const match = rawLine.substring(1).trim().match(/^([^=]+)=(.+)$/);
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

    const whitelistSet = new Set(whitelist.map(w => w.replace(/^\*\./, '')));
    const customDnsSet = new Set(customDns.map(c => c.domain.replace(/^\*\./, '')));
    const excludeSet = new Set([...whitelistSet, ...customDnsSet]);

    domains = domains.filter(d => !excludeSet.has(d.replace(/^\*\./, '')));

    const uniqueWhitelist = [...new Set(whitelist)];
    whitelist = uniqueWhitelist;

    document.getElementById('domainCount').textContent = domains.length;
    document.getElementById('validCount').textContent = domains.length;
    document.getElementById('commentCount').textContent = commentCount;

    if (domains.length > 0 || whitelist.length > 0 || customDns.length > 0) {
        generateRules();
    }
}

function sortDomains() {
    const textarea = document.getElementById('sourceInput');
    const lines = textarea.value.split('\n');
    
    const headerComments = [];
    const bodyComments = [];
    const specialLines = [];
    const domainsList = [];
    
    let inHeader = true;
    let headerEnded = false;
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        const isComment = trimmed.startsWith('#');
        const isSpecial = trimmed.startsWith('+') || trimmed.startsWith('!') || trimmed.startsWith('@');
        
        if (isSpecial) {
            specialLines.push(line);
            continue;
        }
        
        if (inHeader && isComment) {
            headerComments.push(line);
        } else if (!isComment && trimmed.length > 0) {
            inHeader = false;
            domainsList.push(line);
        } else if (!inHeader && isComment) {
            bodyComments.push(line);
        } else {
            if (inHeader && !headerEnded) {
                headerEnded = true;
                inHeader = false;
            }
            domainsList.push(line);
        }
    }
    
    const sortedDomains = [...domainsList].sort((a, b) => {
        const aClean = a.trim().replace(/^(0\.0\.0\.0|127\.0\.0\.1|address=\/)/, '').toLowerCase();
        const bClean = b.trim().replace(/^(0\.0\.0\.0|127\.0\.0\.1|address=\/)/, '').toLowerCase();
        return aClean.localeCompare(bClean);
    });
    
    const sortedBodyComments = [...bodyComments].sort((a, b) => a.localeCompare(b));
    
    const result = [
        ...headerComments,
        ...sortedDomains,
        ...specialLines,
        ...sortedBodyComments
    ];
    
    textarea.value = result.join('\n');
    parseSource();
    showToast(t('toastSorted'));
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

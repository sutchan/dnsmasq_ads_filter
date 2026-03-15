// assets/js/core.js v1.0.3
// Core variables and configuration for DNS Ad Block List Generator

let domains = [];
let urlList = [];
let whitelist = [];
let customDns = [];
let currentFormat = 'hosts';
let outputContent = { dnsmasq: '', hosts: '' };
let isLangZh = true;

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

function getSettings() {
    return settings;
}

function getDomains() {
    return domains;
}

function getWhitelist() {
    return whitelist;
}

function getCustomDns() {
    return customDns;
}

function getOutputContent() {
    return outputContent;
}

function setOutputContent(content) {
    outputContent = content;
}

function isLangChinese() {
    return isLangZh;
}

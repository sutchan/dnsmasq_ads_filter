# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 

### Fixed
- Fixed `raw-domains.txt` rule documentation (`@` syntax)
- Fixed `hosts-manager.html` to support whitelist (`+`), comment domain (`!`), and custom DNS (`@`) prefixes
- Regenerated output files with correct domain count

### Added
- Support for whitelist domains (`+` prefix) in `hosts-manager.html`
- Support for comment domains (`!` prefix) in `hosts-manager.html`
- Support for custom DNS (`@` prefix) in `hosts-manager.html`
- Display of whitelist and custom DNS counts in output info

## [1.0.1] - 2026-03-14

### Fixed
- Fixed IPv6 address format in Dnsmasq rules (`address=/domain/::` instead of `address=/domain::/`)
- Fixed duplicate HTML element `blockIPv6` checkbox
- Fixed JavaScript function structure issues in `hosts-manager.html`
- Fixed duplicate translation objects in JavaScript

### Changed
- Regenerated `dnsmasq-ads-filter-list.txt` with correct format and standard header
- Regenerated `xiaomi-router-hosts-noad.txt` with correct format and standard header
- Updated IP address from `127.0.0.1` to `0.0.0.0` for consistency
- Converted `README.md` from HTML to Markdown format
- Updated `README_CN.md` with complete documentation
- Added file header comment to `hosts-manager.html`

### Added
- Standard header comments to output files
- Version number in HTML title
- Single source workflow documentation

## [1.0.0] - 2026-03-13

### Added
- Initial release
- Dnsmasq ad blocking filter list
- Xiaomi router hosts file
- Web management tool (`hosts-manager.html`)
- Raw domains source file (`raw-domains.txt`)
- Project documentation (README.md, README_CN.md)
- OpenSpec documentation (SPEC.md, TASKS.md, CHECKLIST.md)

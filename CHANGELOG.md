# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] — 2026-05-21

### Added
- `node-version` input — choose Node.js 18, 20, 22, or any version (default: `22`)
- `package-manager` input — supports `npm`, `yarn`, and `pnpm` (default: `npm`)
- `cache-dependency-path` input — monorepo support, point to any lock file
- Integration test workflow covering npm, pnpm, yarn, and pinned CLI version
- Windows and macOS runner coverage in CI

### Changed
- Converted from Node.js action to composite action — no compilation step, no `dist/` directory
- Upgraded Node.js runtime from 20 → 22
- Action name updated to `Angular Setup` for better marketplace discoverability
- Completely rewritten README with copy-paste examples for all package managers

### Removed
- TypeScript source (`src/action.ts`)
- Compiled dist (`dist/action.js`)
- `package.json`, `package-lock.json`, `tsconfig.json` — no longer needed

### Migration from v1
All existing `v1` workflows continue to work unchanged — new inputs are optional with backwards-compatible defaults.

```yml
# v1 (still works)
- uses: mayurrawte/github-angular-actions@v1
  with:
    version: '17.3.8'

# v2 (recommended)
- uses: mayurrawte/github-angular-actions@v2
  with:
    version: '17.3.8'
    node-version: '22'
    package-manager: 'npm'
```

## [1.1.0] — 2022-10-01

### Changed
- Migrated codebase to TypeScript

## [1.0.0] — 2021

### Added
- Initial release: install Angular CLI at a specific version with npm cache

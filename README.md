# Angular Setup — GitHub Action

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![Test Action](https://github.com/mayurrawte/github-angular-actions/actions/workflows/test.yml/badge.svg)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Angular%20Setup-blue?logo=github)](https://github.com/marketplace/actions/angular-github-actions)
![Platforms](https://img.shields.io/badge/runs%20on-ubuntu%20%7C%20windows%20%7C%20macos-lightgrey)

> **One step.** Set up Node.js, cache your package manager, and install Angular CLI.
> Works with **npm**, **yarn**, and **pnpm** — no boilerplate required.

---

## Quick start

```yml
- uses: mayurrawte/github-angular-actions@v2
```

Installs the latest Angular CLI on Node 22 with npm caching. Zero config.

---

## Inputs

| Input | Default | Description |
|-------|---------|-------------|
| `version` | `latest` | Angular CLI version — e.g. `17.3.8`, `18.0.0`, or `latest` |
| `node-version` | `22` | Node.js version — e.g. `22`, `20`, `18` |
| `package-manager` | `npm` | `npm`, `yarn`, or `pnpm` |
| `cache-dependency-path` | _(repo root)_ | Lock file path for monorepos |

## Outputs

| Output | Description |
|--------|-------------|
| `cli-version` | Installed Angular CLI version, e.g. `17.3.8` |

---

## Examples

### Default — latest Angular, Node 22, npm

```yml
steps:
  - uses: actions/checkout@v4
  - uses: mayurrawte/github-angular-actions@v2
  - run: npm ci
  - run: npm run build
```

### Pin Angular CLI and Node versions

```yml
steps:
  - uses: actions/checkout@v4
  - uses: mayurrawte/github-angular-actions@v2
    with:
      version: '17.3.8'
      node-version: '20'
  - run: npm ci
  - run: npm test -- --watch=false --browsers=ChromeHeadless
```

### Angular 16+ with Jest

Angular 16 and above supports Jest as the test runner. No extra setup needed — just run your test command after the action:

```yml
steps:
  - uses: actions/checkout@v4
  - uses: mayurrawte/github-angular-actions@v2
    with:
      version: 'latest'
      node-version: '22'
  - run: npm ci
  - run: npm test  # runs Jest if configured via ng generate jest
```

### pnpm

```yml
steps:
  - uses: actions/checkout@v4
  - uses: mayurrawte/github-angular-actions@v2
    with:
      node-version: '22'
      package-manager: 'pnpm'
  - run: pnpm install
  - run: pnpm build
```

### yarn

```yml
steps:
  - uses: actions/checkout@v4
  - uses: mayurrawte/github-angular-actions@v2
    with:
      node-version: '22'
      package-manager: 'yarn'
  - run: yarn install --frozen-lockfile
  - run: yarn build
```

### Monorepo — lock file in a subdirectory

```yml
steps:
  - uses: actions/checkout@v4
  - uses: mayurrawte/github-angular-actions@v2
    with:
      package-manager: 'npm'
      cache-dependency-path: 'packages/app/package-lock.json'
  - run: npm ci --workspace=packages/app
```

### Use the `cli-version` output downstream

```yml
steps:
  - uses: actions/checkout@v4
  - uses: mayurrawte/github-angular-actions@v2
    id: ng-setup
  - run: echo "Running on Angular CLI ${{ steps.ng-setup.outputs.cli-version }}"
```

---

## Why this action?

| Feature | This action | `actions/setup-node` only |
|---------|:-----------:|:-------------------------:|
| Installs Angular CLI globally | ✅ | ❌ |
| Specific CLI version | ✅ | ❌ |
| Node.js version selection | ✅ | ✅ |
| npm caching | ✅ | ✅ |
| **pnpm caching** | ✅ | ✅ (manual config) |
| **yarn caching** | ✅ | ✅ (manual config) |
| Monorepo lock file path | ✅ | ✅ (manual config) |
| Exposes `cli-version` output | ✅ | ❌ |
| Zero config | ✅ | ❌ (need extra step) |

Use this action when `@angular/cli` is **not** in your `devDependencies` — common in legacy projects, shared runner setups, or anywhere you run `ng` directly in CI scripts.

---

## License

MIT

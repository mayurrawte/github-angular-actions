# Angular Github Actions

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![Test Action](https://github.com/mayurrawte/github-angular-actions/actions/workflows/test.yml/badge.svg)

> GitHub Action to set up Node.js, cache your package manager, and install Angular CLI — all in one step.
> Supports **npm**, **yarn**, and **pnpm**.

---

## Quick start

```yml
- uses: mayurrawte/github-angular-actions@v2
```

That's it. Installs the latest Angular CLI with Node 22 and npm caching enabled by default.

---

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `version` | No | `latest` | Angular CLI version to install (e.g. `17.3.8`, `18.0.0`, `latest`) |
| `node-version` | No | `22` | Node.js version (e.g. `22`, `20`, `18`) |
| `package-manager` | No | `npm` | Package manager: `npm`, `yarn`, or `pnpm` |
| `cache-dependency-path` | No | _(repo root)_ | Path to lock file for caching (useful for monorepos) |

## Outputs

| Output | Description |
|--------|-------------|
| `cli-version` | The installed Angular CLI version string (e.g. `17.3.8`) |

---

## Examples

### Minimal — latest everything

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

### Use pnpm

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

### Use yarn

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

### Capture the installed CLI version

```yml
steps:
  - uses: actions/checkout@v4
  - uses: mayurrawte/github-angular-actions@v2
    id: ng-setup
    with:
      version: 'latest'
  - run: echo "Installed Angular CLI ${{ steps.ng-setup.outputs.cli-version }}"
```

---

## When to use this vs `actions/setup-node`

Use this action when you want a **globally installed Angular CLI** at a specific version — common in:
- Legacy projects that run `ng` directly in CI scripts
- Shared runner environments where multiple Angular projects need the same CLI
- Environments where `@angular/cli` is not a devDependency

If `@angular/cli` is already in your `package.json` devDependencies (most modern projects), `actions/setup-node@v4` with `cache: npm` is sufficient — you don't need this action.

---

## License

MIT

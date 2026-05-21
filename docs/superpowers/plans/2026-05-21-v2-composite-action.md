# Angular Github Actions v2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Node.js action into a composite action that supports `node-version`, `package-manager` (npm/yarn/pnpm), and Angular CLI version selection — filling the gap no competitor covers.

**Architecture:** Replace the TypeScript/dist approach with a pure-YAML composite action that shells out to `actions/setup-node@v4` and `pnpm/action-setup@v4` as sub-steps. No compilation step. No dist directory. Shell scripts handle CLI install and version detection.

**Tech Stack:** YAML composite action, Bash shell steps, `actions/setup-node@v4`, `pnpm/action-setup@v4`

---

## File Map

| Status | File | Purpose |
|--------|------|---------|
| **Rewrite** | `action.yml` | Composite action definition with new inputs |
| **Create** | `.github/workflows/test.yml` | Integration test — runs action with npm, yarn, pnpm |
| **Update** | `README.md` | Document all new inputs with copy-paste examples |
| **Delete** | `src/action.ts` | Obsolete — logic moves to shell steps in action.yml |
| **Delete** | `dist/action.js` | Obsolete — no longer a Node action |
| **Delete** | `package.json` | Obsolete — no npm dependencies |
| **Delete** | `package-lock.json` | Obsolete |
| **Delete** | `tsconfig.json` | Obsolete |

---

## Task 1: Create a feature branch

**Files:** (git only)

- [ ] **Step 1: Create and switch to v2 branch**

```bash
cd /Users/mayurrawte/github-angular-actions
git checkout -b feat/v2-composite-action
```

Expected: `Switched to a new branch 'feat/v2-composite-action'`

---

## Task 2: Rewrite action.yml as composite action

**Files:**
- Rewrite: `action.yml`

- [ ] **Step 1: Overwrite action.yml with the composite definition**

Replace the entire file with:

```yaml
name: 'Angular Github Actions'
description: 'Setup Node.js, package manager caching, and Angular CLI — npm, yarn, and pnpm supported'
author: 'Mayur Rawte'
branding:
  icon: 'layers'
  color: 'red'

inputs:
  version:
    description: 'Angular CLI version to install (e.g. 17.3.8, 18.0.0, or latest)'
    required: false
    default: 'latest'
  node-version:
    description: 'Node.js version to use (e.g. 22, 20, 18)'
    required: false
    default: '22'
  package-manager:
    description: 'Package manager to cache and use for the global CLI install: npm, yarn, or pnpm'
    required: false
    default: 'npm'
  cache-dependency-path:
    description: 'Path to the lock file for caching (e.g. packages/app/package-lock.json). Defaults to repo root.'
    required: false
    default: ''

outputs:
  cli-version:
    description: 'The installed Angular CLI version string (e.g. 17.3.8)'
    value: ${{ steps.get-version.outputs.cli-version }}

runs:
  using: composite
  steps:
    - name: Setup pnpm
      if: ${{ inputs.package-manager == 'pnpm' }}
      uses: pnpm/action-setup@v4
      with:
        version: latest

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: ${{ inputs.package-manager }}
        cache-dependency-path: ${{ inputs.cache-dependency-path }}

    - name: Install Angular CLI (npm)
      if: ${{ inputs.package-manager == 'npm' || inputs.package-manager == '' }}
      shell: bash
      run: npm install -g @angular/cli@${{ inputs.version }}

    - name: Install Angular CLI (pnpm)
      if: ${{ inputs.package-manager == 'pnpm' }}
      shell: bash
      run: pnpm add -g @angular/cli@${{ inputs.version }}

    - name: Install Angular CLI (yarn)
      if: ${{ inputs.package-manager == 'yarn' }}
      shell: bash
      run: yarn global add @angular/cli@${{ inputs.version }}

    - name: Get Angular CLI version
      id: get-version
      shell: bash
      run: |
        CLI_VERSION=$(ng version 2>/dev/null | grep -i 'Angular CLI:' | awk '{print $NF}' || echo "unknown")
        echo "cli-version=$CLI_VERSION" >> "$GITHUB_OUTPUT"
```

- [ ] **Step 2: Verify YAML is valid**

```bash
cd /Users/mayurrawte/github-angular-actions
python3 -c "import yaml; yaml.safe_load(open('action.yml'))" && echo "YAML valid"
```

Expected: `YAML valid`

- [ ] **Step 3: Commit**

```bash
git add action.yml
git commit -m "feat: convert to composite action with node-version and package-manager inputs"
```

---

## Task 3: Delete obsolete files

**Files:**
- Delete: `src/action.ts`, `dist/action.js`, `package.json`, `package-lock.json`, `tsconfig.json`

- [ ] **Step 1: Remove the TypeScript source and compiled dist**

```bash
cd /Users/mayurrawte/github-angular-actions
git rm src/action.ts dist/action.js package.json package-lock.json tsconfig.json
```

Expected: output like `rm 'src/action.ts'`, `rm 'dist/action.js'` etc.

- [ ] **Step 2: Verify only the right files remain**

```bash
git status
find . -not -path './.git/*' -not -path './docs/*' -not -path './node_modules/*' -type f | sort
```

Expected files remaining:
```
./.gitignore
./action.yml
./README.md
./docs/superpowers/plans/2026-05-21-v2-composite-action.md
```

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove obsolete TypeScript source, dist, and npm files"
```

---

## Task 4: Write integration test workflow

**Files:**
- Create: `.github/workflows/test.yml`

- [ ] **Step 1: Create the workflows directory**

```bash
mkdir -p /Users/mayurrawte/github-angular-actions/.github/workflows
```

- [ ] **Step 2: Write the test workflow**

```yaml
# .github/workflows/test.yml
name: Test Action

on:
  push:
    branches: [master, main, 'feat/**']
  pull_request:
    branches: [master, main]

jobs:
  test-npm:
    name: Test — npm
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run action with npm (default)
        id: setup
        uses: ./
        with:
          version: 'latest'
          node-version: '22'
          package-manager: 'npm'

      - name: Verify CLI version output is set
        shell: bash
        run: |
          echo "CLI version: ${{ steps.setup.outputs.cli-version }}"
          if [ "${{ steps.setup.outputs.cli-version }}" = "unknown" ]; then
            echo "ERROR: cli-version output was 'unknown'"
            exit 1
          fi

      - name: Verify ng is on PATH
        shell: bash
        run: ng version

  test-pnpm:
    name: Test — pnpm
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run action with pnpm
        id: setup
        uses: ./
        with:
          version: 'latest'
          node-version: '22'
          package-manager: 'pnpm'

      - name: Verify CLI version output is set
        shell: bash
        run: |
          echo "CLI version: ${{ steps.setup.outputs.cli-version }}"
          if [ "${{ steps.setup.outputs.cli-version }}" = "unknown" ]; then
            echo "ERROR: cli-version output was 'unknown'"
            exit 1
          fi

      - name: Verify ng is on PATH
        shell: bash
        run: ng version

  test-yarn:
    name: Test — yarn
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run action with yarn
        id: setup
        uses: ./
        with:
          version: 'latest'
          node-version: '22'
          package-manager: 'yarn'

      - name: Verify CLI version output is set
        shell: bash
        run: |
          echo "CLI version: ${{ steps.setup.outputs.cli-version }}"
          if [ "${{ steps.setup.outputs.cli-version }}" = "unknown" ]; then
            echo "ERROR: cli-version output was 'unknown'"
            exit 1
          fi

      - name: Verify ng is on PATH
        shell: bash
        run: ng version

  test-pinned-version:
    name: Test — pinned Angular version
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run action with pinned Angular CLI version
        id: setup
        uses: ./
        with:
          version: '17.3.8'
          node-version: '20'
          package-manager: 'npm'

      - name: Verify the correct version was installed
        shell: bash
        run: |
          INSTALLED="${{ steps.setup.outputs.cli-version }}"
          echo "Installed: $INSTALLED"
          if [ "$INSTALLED" != "17.3.8" ]; then
            echo "ERROR: expected 17.3.8, got $INSTALLED"
            exit 1
          fi
```

- [ ] **Step 3: Verify YAML is valid**

```bash
python3 -c "import yaml; yaml.safe_load(open('/Users/mayurrawte/github-angular-actions/.github/workflows/test.yml'))" && echo "YAML valid"
```

Expected: `YAML valid`

- [ ] **Step 4: Commit**

```bash
cd /Users/mayurrawte/github-angular-actions
git add .github/workflows/test.yml
git commit -m "test: add integration test workflow for npm, pnpm, yarn, and pinned version"
```

---

## Task 5: Update README

**Files:**
- Rewrite: `README.md`

- [ ] **Step 1: Overwrite README.md**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/mayurrawte/github-angular-actions
git add README.md
git commit -m "docs: rewrite README with v2 inputs, pnpm/yarn examples, and usage guidance"
```

---

## Task 6: Tag and push

- [ ] **Step 1: Verify the full diff looks right**

```bash
cd /Users/mayurrawte/github-angular-actions
git log --oneline
git diff master..HEAD --stat
```

Expected: 4 commits since master, touching `action.yml`, removed src/dist/package files, new test workflow, updated README.

- [ ] **Step 2: Push the feature branch**

```bash
cd /Users/mayurrawte/github-angular-actions
git push origin feat/v2-composite-action
```

- [ ] **Step 3: Open a PR (or merge directly to master)**

If opening a PR:
```bash
gh pr create \
  --title "feat: v2.0 — composite action with pnpm/yarn/node-version support" \
  --body "## What's changed

- Converted from Node.js action to composite action (no compilation step)
- Added \`node-version\` input (default: \`22\`)
- Added \`package-manager\` input — supports \`npm\`, \`yarn\`, \`pnpm\`
- Added \`cache-dependency-path\` input for monorepos
- Removed obsolete TypeScript source, dist, and package files
- Added integration test workflow testing all three package managers
- Updated README with full examples" \
  --base master
```

- [ ] **Step 4: After merging to master, tag v2.0.0**

```bash
git checkout master
git pull origin master
git tag v2.0.0
git tag v2    # floating tag — users pin to @v2
git push origin v2.0.0 v2
```

---

## Self-review checklist

- [x] All new inputs (`node-version`, `package-manager`, `cache-dependency-path`) have defaults → backwards compatible, existing users don't break
- [x] `pnpm/action-setup` step only runs when `package-manager == 'pnpm'` — no side effects for npm/yarn users
- [x] `cli-version` output wired through `steps.get-version.outputs.cli-version` from the composite's output block
- [x] Test workflow covers all three package managers + pinned CLI version
- [x] README `uses:` reference updated from `actions/angular-github-actions` to `mayurrawte/github-angular-actions@v2`
- [x] No TypeScript files referenced anywhere after deletion
- [x] No placeholder steps — all code blocks are complete

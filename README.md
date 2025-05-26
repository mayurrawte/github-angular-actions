
# Github Angular Actions

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

GitHub Action to install Angular CLI with optional version selection.
The action now caches the npm cache to speed up subsequent runs.



## Usage


```yml
- name: Install Latest Angular
  uses: actions/angular-github-actions
```

You can also specify the version

```yml
- name: Install Angular 12.2.7
  uses: actions/angular-github-actions
  with:
    version: 12.2.7
```
## Outputs

- `cli-version` – the installed Angular CLI version

Caching for the npm directory is enabled by default to optimize your workflow.

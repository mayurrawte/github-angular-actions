
# Github Angular Actions

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

GitHub Action to preinstall angular-cli and other dependencies.
You can configure ng versions.



## Usage


```yml
name: Install Latest Angular
uses: actions/angular-github-actions
```

You can also specify the version

```yml
name: Install Angular 12.2.7
uses: actions/angular-github-actions
with:
    version: 12.2.7
```
## Roadmap

- Support Caching to optimize your gh action workflow.

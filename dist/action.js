import * as core from '@actions/core';
import * as child_process from 'child_process';
let version = core.getInput('version');
version = version ? version : 'latest';
core.setOutput("Getting Version", version);
const stOut = child_process.execSync('npm install -g @angular/cli@' + version).toString();
core.setOutput("Result", stOut);

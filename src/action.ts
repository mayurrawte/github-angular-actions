import { restoreCache, saveCache } from '@actions/cache';
import * as core from '@actions/core';
import * as github from '@actions/github';
import * as path from 'path';
import * as child from 'child_process';
import { globalPath} from './constant';
import fs from 'fs';
import * as os from 'os';



``
const angularLog = child.execSync('npm install -g @angular/cli').toString();
// const nxLog = child.execSync('npm install -g nx');

// const nxPath = globalPath + '/nx'
const ngPath = globalPath + '/ng'
// create cache
console.log(child.execSync('cp ' + ngPath + os.tmpdir()).toString());
console.log('copied');
console.log(angularLog)
console.log(child.execSync('cp ' + ngPath + ' .').toString());







// restoreCache([nxpath], 'git-angular-actions-nx').then((data) => {
//     console.log(data);
// })

// check for cache
// console.log(restoreCache();

//  const cache = core.getInput('cache');
//  console.log(cache)
//  console.log('I am here')
//  execute("npm install -g @angular/cli")
//  execute("npm install -g nx")
//  execute("npm install -g cypess")

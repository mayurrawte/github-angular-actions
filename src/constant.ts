
import * as child from 'child_process';
export const CacheMatchedKey = 'git-angular-action-cache-matched';
export const PrimaryKey = 'git-angular-action-primary'
import * as path from 'path';


export const globalPath = path.dirname(child.execSync('which node').toString())
export const nxpath =  'git-angular-actions-cached-dir';
export const primaryKey = 'gaac'
import * as core from '@actions/core';
import * as cache from '@actions/cache';
import { execSync } from 'child_process';
async function run() {
  let version = core.getInput('version') || 'latest';
  core.info(`Installing Angular CLI @${version}`);
  const npmCachePath = execSync('npm config get cache').toString().trim();
  try {
    await cache.restoreCache([npmCachePath], `npm-cache-${process.platform}-${process.arch}`);
  }
  catch (e) {
    core.debug(`Cache restore failed: ${e}`);
  }
  const installOutput = execSync(`npm install -g @angular/cli@${version}`).toString();
  core.setOutput('installation-output', installOutput);
  let cliVersion = 'unknown';
  try {
    const json = execSync('npx ng version --json').toString();
    cliVersion = JSON.parse(json).cli.version;
  }
  catch (e) {
    core.warning(`Could not determine Angular CLI version: ${e}`);
  }
  core.setOutput('cli-version', cliVersion);
  try {
    await cache.saveCache([npmCachePath], `npm-cache-${process.platform}-${process.arch}`);
  }
  catch (e) {
    core.debug(`Cache save failed: ${e}`);
  }
}
run().catch(err => core.setFailed(err.message));

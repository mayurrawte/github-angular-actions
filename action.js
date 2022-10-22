const core = require('@actions/core');
const github = require('@actions/github');

function execute(command) {
   const exec = require('child_process').exec
   exec(command, (err, stdout, stderr) => {
     process.stdout.write(stdout)
   })
 }
 execute("npm install -g @angular/cli")
 execute("npm install -g nx")
 execute("npm install -g cypess")

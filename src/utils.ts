import * as child from 'child_process';

export const executeCliCommand = (command:string) => {
    child.exec(command, (err, stdout, stderr) => {
      process.stdout.write(stdout)
    })
}
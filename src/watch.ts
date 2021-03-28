#!/usr/bin/env node

import chalk from "chalk";
import { spawn } from "child_process";

import { generate } from "./generate";
import { readConfig } from "./config";

const log = console.log;

function spawnCodegenDemon(watch: string) {
  const cp = spawn("nodemon", ["--ext", "*.shex", "--watch", watch], {
    // the important part is the 4th option 'ipc'
    // this way `process.send` will be available in the child process (nodemon)
    // so it can communicate back with parent process (through `.on()`, `.send()`)
    // https://nodejs.org/api/child_process.html#child_process_options_stdio
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });
  console.clear();

  return cp;
}

// if used from node cli
if (require.main === module) {
  const config = readConfig();
  var app = spawnCodegenDemon(config?.schema ?? process.cwd());

  app.on("message", function (event: { type: string; data: string[] }) {
    if (event.type === "start") {
    } else if (event.type === "restart") {
      console.clear();
      log("shex-codegen is in watch mode...\n");
      if (Array.isArray(event.data)) {
        log(chalk.yellow("Restarted") + " due to changes in:\n");
        event.data.forEach((file: string) => {
          log(chalk.yellow(file));
        });
        log("\n");

        log(chalk.green("Generated") + " types for:\n");
        event.data.forEach((file: string) => {
          generate(file);
          log(chalk.green(file) + "\n");
        });
      }
    }
  });

  // force a restart
  app.send("restart");
}
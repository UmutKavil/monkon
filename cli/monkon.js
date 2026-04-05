#!/usr/bin/env node

import { Command } from 'commander';
import start from './commands/start.js';
import stop from './commands/stop.js';
import status from './commands/status.js';
import logs from './commands/logs.js';
import restart from './commands/restart.js';
import config from './commands/config.js';
import dashboard from './commands/dashboard.js';

const program = new Command();

program
  .name('monkon')
  .description('⚡ Modern development environment for PHP, MySQL, and Apache')
  .version('0.1.0');

program.addCommand(start);
program.addCommand(stop);
program.addCommand(status);
program.addCommand(logs);
program.addCommand(restart);
program.addCommand(config);
program.addCommand(dashboard);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

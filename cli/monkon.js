#!/usr/bin/env node

import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import chalk from 'chalk';

// Import commands
import startCommand from './commands/start.js';
import stopCommand from './commands/stop.js';
import statusCommand from './commands/status.js';
import logsCommand from './commands/logs.js';
import configCommand from './commands/config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

program
  .name('monkon')
  .description(chalk.cyan('🎯 monkon - Developer-friendly local dev environment'))
  .version(packageJson.version)
  .usage('[command]');

// Register commands
program.addCommand(startCommand);
program.addCommand(stopCommand);
program.addCommand(statusCommand);
program.addCommand(logsCommand);
program.addCommand(configCommand);

// Help text
program.on('--help', () => {
  console.log('');
  console.log(chalk.green('Examples:'));
  console.log('  $ monkon start       Start all services');
  console.log('  $ monkon stop        Stop all services');
  console.log('  $ monkon status      Show service status');
  console.log('  $ monkon logs        View service logs');
  console.log('  $ monkon config      Edit configuration');
  console.log('');
});

program.parse(process.argv);

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

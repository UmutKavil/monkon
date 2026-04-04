#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const program = new Command();

program
  .name('monkon')
  .description('🚀 Modern development environment for PHP, MySQL, and Apache')
  .version('0.1.0');

// Start command
program
  .command('start')
  .description('Start all monkon services')
  .action(() => {
    try {
      console.log(chalk.blue('\n⏳  Starting monkon services...\n'));
      execSync('docker-compose up -d', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log(chalk.green('✅  monkon services started!'));
      console.log(chalk.gray('\nServices:'));
      console.log(chalk.gray('  • Apache:     http://localhost'));
      console.log(chalk.gray('  • PhpMyAdmin: http://localhost:8080'));
      console.log(chalk.gray('  • MySQL:      localhost:3306\n'));
    } catch (error) {
      console.error(chalk.red('❌  Error starting services:'), error.message);
      process.exit(1);
    }
  });

// Stop command
program
  .command('stop')
  .description('Stop all monkon services')
  .action(() => {
    try {
      console.log(chalk.blue('\n⏳  Stopping monkon services...\n'));
      execSync('docker-compose stop', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log(chalk.green('✅  monkon services stopped!\n'));
    } catch (error) {
      console.error(chalk.red('❌  Error stopping services:'), error.message);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show status of all monkon services')
  .action(() => {
    try {
      console.log(chalk.blue('\n📊  monkon Services Status:\n'));
      execSync('docker-compose ps', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log('');
    } catch (error) {
      console.error(chalk.red('❌  Error getting status:'), error.message);
      process.exit(1);
    }
  });

// Logs command
program
  .command('logs [service]')
  .description('Show logs from services')
  .action((service) => {
    try {
      console.log(chalk.blue('\n📝  monkon Logs:\n'));
      const cmd = service ? `docker-compose logs --tail 50 ${service}` : 'docker-compose logs --tail 50';
      execSync(cmd, { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log('');
    } catch (error) {
      console.error(chalk.red('❌  Error getting logs:'), error.message);
      process.exit(1);
    }
  });

// Restart command
program
  .command('restart [service]')
  .description('Restart services')
  .action((service) => {
    try {
      const serviceName = service || 'all services';
      console.log(chalk.blue(`\n⏳  Restarting ${serviceName}...\n`));
      const cmd = service ? `docker-compose restart ${service}` : 'docker-compose restart';
      execSync(cmd, { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log(chalk.green(`✅  ${serviceName} restarted!\n`));
    } catch (error) {
      console.error(chalk.red('❌  Error restarting services:'), error.message);
      process.exit(1);
    }
  });

// Dashboard command
program
  .command('dashboard')
  .description('Open monkon desktop application')
  .action(() => {
    try {
      console.log(chalk.blue('\n🖥️   Opening monkon dashboard...\n'));
      execSync('npm run dev:electron', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
    } catch (error) {
      console.error(chalk.red('❌  Error opening dashboard:'), error.message);
      process.exit(1);
    }
  });

// Config command
program
  .command('config')
  .description('Show configuration')
  .action(() => {
    console.log(chalk.blue('\n⚙️   monkon Configuration:\n'));
    console.log(chalk.gray('Web Root:        ~/monkon/www'));
    console.log(chalk.gray('Config Dir:      ~/.monkon'));
    console.log(chalk.gray('Apache Port:     80'));
    console.log(chalk.gray('MySQL Port:      3306'));
    console.log(chalk.gray('PhpMyAdmin Port: 8080\n'));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

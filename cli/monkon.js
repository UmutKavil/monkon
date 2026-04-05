#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const program = new Command();

program
  .name('monkon')
  .description('⚡ Modern development environment for PHP, MySQL, and Apache')
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
  .description('Start web dashboard at http://localhost:3000')
  .action(() => {
    try {
      console.log(chalk.blue('\n🌐  Starting monkon dashboard...\n'));

      // Start Express server
      const server = spawn('node', [path.join(__dirname, '../dashboard/server.js')], {
        detached: true,
        stdio: 'pipe'
      });

      let started = false;
      server.stdout?.on('data', (data) => {
        const msg = data.toString();
        if (!started && msg.includes('monkon Dashboard is running')) {
          started = true;
          console.log(chalk.green('✅  Dashboard is running!\n'));
          console.log(chalk.blue('📱 Open your browser: http://localhost:3000\n'));
          console.log(chalk.gray('Press Ctrl+C to stop\n'));
          server.unref();
        }
      });
      server.stderr?.on('data', (data) => {
        console.error('Server error:', data.toString());
      });

      // Keep process running
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\n\n✋  Shutting down...\n'));
        process.exit(0);
      });
    } catch (error) {
      console.error(chalk.red('❌  Error starting dashboard:'), error.message);
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

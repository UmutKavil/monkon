import { Command } from 'commander';
import chalk from 'chalk';
import { execa } from 'execa';
import { existsSync } from 'fs';

const start = new Command('start')
  .description('Start monkon services')
  .option('-s, --service <service>', 'Start specific service (php, mysql, phpmyadmin)')
  .action(async (options) => {
    try {
      console.log(chalk.cyan('🚀 Starting monkon services...'));

      // Check if Docker is running
      try {
        await execa('docker', ['ps']);
      } catch {
        console.error(
          chalk.red('❌ Docker is not running. Please start Docker and try again.')
        );
        process.exit(1);
      }

      // Check if docker-compose.yml exists
      if (!existsSync('docker-compose.yml')) {
        console.error(
          chalk.red('❌ docker-compose.yml not found. Are you in the monkon directory?')
        );
        process.exit(1);
      }

      if (options.service) {
        // Start specific service
        await execa('docker-compose', ['up', '-d', options.service]);
        console.log(chalk.green(`✅ ${options.service} service started`));
      } else {
        // Start all services
        await execa('docker-compose', ['up', '-d']);
        console.log(chalk.green('✅ All services started'));
        console.log('');
        console.log(chalk.yellow('📝 Web Root: ~/monkon/www'));
        console.log(chalk.yellow('🌐 Apache: http://localhost'));
        console.log(chalk.yellow('🗄️  MySQL: localhost:3306'));
        console.log(chalk.yellow('📊 PhpMyAdmin: http://localhost/phpmyadmin'));
        console.log('');
      }
    } catch (error) {
      console.error(chalk.red('❌ Error starting services:'), error.message);
      process.exit(1);
    }
  });

export default start;

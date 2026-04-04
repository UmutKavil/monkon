import { Command } from 'commander';
import chalk from 'chalk';
import { execa } from 'execa';

const stop = new Command('stop')
  .description('Stop monkon services')
  .option('-s, --service <service>', 'Stop specific service (php, mysql, phpmyadmin)')
  .action(async (options) => {
    try {
      console.log(chalk.cyan('🛑 Stopping monkon services...'));

      if (options.service) {
        // Stop specific service
        await execa('docker-compose', ['stop', options.service]);
        console.log(chalk.green(`✅ ${options.service} service stopped`));
      } else {
        // Stop all services
        await execa('docker-compose', ['stop']);
        console.log(chalk.green('✅ All services stopped'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error stopping services:'), error.message);
      process.exit(1);
    }
  });

export default stop;

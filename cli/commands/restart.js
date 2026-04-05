import { Command } from 'commander';
import chalk from 'chalk';
import { execa } from 'execa';

const restart = new Command('restart')
  .description('Restart monkon services')
  .option('-s, --service <service>', 'Restart specific service (php, apache, mysql, phpmyadmin)')
  .action(async (options) => {
    try {
      if (options.service) {
        console.log(chalk.cyan(`♻️  Restarting ${options.service}...`));
        await execa('docker-compose', ['restart', options.service], { stdio: 'inherit' });
        console.log(chalk.green(`✅ ${options.service} restarted`));
      } else {
        console.log(chalk.cyan('♻️  Restarting all services...'));
        await execa('docker-compose', ['restart'], { stdio: 'inherit' });
        console.log(chalk.green('✅ All services restarted'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error restarting services:'), error.message);
      process.exit(1);
    }
  });

export default restart;

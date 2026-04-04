import { Command } from 'commander';
import chalk from 'chalk';
import { execa } from 'execa';

const logs = new Command('logs')
  .description('View monkon service logs')
  .option('-s, --service <service>', 'View specific service logs (php, mysql, phpmyadmin)')
  .option('-f, --follow', 'Follow log output')
  .option('-n, --lines <number>', 'Number of lines to show (default: 50)')
  .action(async (options) => {
    try {
      const args = ['logs'];

      if (options.follow) {
        args.push('-f');
      }

      if (options.lines) {
        args.push('--tail', options.lines);
      } else {
        args.push('--tail', '50');
      }

      if (options.service) {
        args.push(options.service);
      }

      console.log(chalk.cyan(`📝 Showing logs${options.follow ? ' (following)' : ''}...`));
      console.log('');

      const subprocess = execa('docker-compose', args);

      // Stream output
      subprocess.stdout?.pipe(process.stdout);
      subprocess.stderr?.pipe(process.stderr);

      await subprocess;
    } catch (error) {
      if (error.signal !== 'SIGINT') {
        console.error(chalk.red('❌ Error viewing logs:'), error.message);
        process.exit(1);
      }
    }
  });

export default logs;

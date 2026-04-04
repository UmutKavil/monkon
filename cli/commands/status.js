import { Command } from 'commander';
import chalk from 'chalk';
import { execa } from 'execa';
import { table } from 'table';

const status = new Command('status')
  .description('Show monkon services status')
  .action(async () => {
    try {
      console.log(chalk.cyan('📊 Checking monkon services status...'));
      console.log('');

      const result = await execa('docker-compose', ['ps', '--format', 'json']);
      let containers;

      try {
        containers = JSON.parse(result.stdout);
      } catch {
        containers = [];
      }

      if (containers.length === 0) {
        console.log(chalk.yellow('⚠️  No services found. Run "monkon start" to start services.'));
        return;
      }

      // Build table data
      const tableData = [
        [
          chalk.bold('Service'),
          chalk.bold('Status'),
          chalk.bold('Ports'),
          chalk.bold('Container ID'),
        ],
        ...containers.map((container) => [
          container.Service || container.Names || 'N/A',
          container.State === 'running'
            ? chalk.green('✅ Running')
            : chalk.red('❌ Stopped'),
          container.Ports || '-',
          (container.ID || '').substring(0, 12),
        ]),
      ];

      console.log(table(tableData));
    } catch (error) {
      console.error(chalk.red('❌ Error checking status:'), error.message);
      process.exit(1);
    }
  });

export default status;

import { Command } from 'commander';
import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dashboard = new Command('dashboard')
  .description('Start web dashboard at http://localhost:3000')
  .option('-p, --port <port>', 'Dashboard port', '3000')
  .action((options) => {
    const port = options.port;

    console.log(chalk.cyan(`\n🌐 Starting monkon dashboard on port ${port}...\n`));

    const server = spawn('node', [path.join(__dirname, '../../dashboard/server.js')], {
      detached: true,
      stdio: 'pipe',
      env: { ...process.env, PORT: port },
    });

    let started = false;

    server.stdout?.on('data', (data) => {
      const msg = data.toString();
      if (!started && msg.includes('monkon Dashboard running')) {
        started = true;
        console.log(chalk.green('✅ Dashboard is running!\n'));
        console.log(chalk.blue(`📱 Open your browser: http://localhost:${port}\n`));
        console.log(chalk.gray('Press Ctrl+C to stop\n'));
        server.unref();
      }
    });

    server.stderr?.on('data', (data) => {
      console.error(chalk.red('Server error:'), data.toString());
    });

    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n✋ Shutting down dashboard...\n'));
      process.exit(0);
    });
  });

export default dashboard;

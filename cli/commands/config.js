import { Command } from 'commander';
import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { expandSync } from 'glob';
import { homedir } from 'os';
import { join } from 'path';
import { execa } from 'execa';

const configDir = join(homedir(), '.monkon');
const configFile = join(configDir, 'config');

const config = new Command('config')
  .description('Manage monkon configuration')
  .option('-l, --list', 'List all configuration options')
  .option('-g, --get <key>', 'Get a specific configuration value')
  .option('-s, --set <key> <value>', 'Set a configuration value')
  .option('-e, --edit', 'Edit configuration in default editor')
  .action(async (options) => {
    try {
      if (options.list) {
        // List all configurations
        console.log(chalk.cyan('📋 Current Configuration:'));
        console.log('');

        let content = 'No configuration found. Using defaults.';
        if (existsSync(configFile)) {
          content = readFileSync(configFile, 'utf-8');
        }

        console.log(content);
      } else if (options.get) {
        // Get specific config
        if (!existsSync(configFile)) {
          console.log(chalk.yellow(`⚠️  Configuration not found for key: ${options.get}`));
          return;
        }

        const content = readFileSync(configFile, 'utf-8');
        const lines = content.split('\n');
        const found = lines.find((line) => line.startsWith(`${options.get}=`));

        if (found) {
          const value = found.split('=')[1];
          console.log(chalk.green(`${options.get}=${value}`));
        } else {
          console.log(chalk.yellow(`⚠️  Configuration key not found: ${options.get}`));
        }
      } else if (options.set) {
        // This would require additional parameter parsing
        console.log(chalk.yellow('ℹ️  Use "monkon config --edit" to modify configurations'));
      } else if (options.edit) {
        // Open config in editor
        const editor = process.env.EDITOR || 'nano';

        // Ensure config directory and file exist
        if (!existsSync(configDir)) {
          await execa('mkdir', ['-p', configDir]);
        }

        if (!existsSync(configFile)) {
          const defaultConfig = `# monkon Configuration
# Set your configuration options here

# Example:
# PHP_VERSION=8.3
# MYSQL_VERSION=8.0
`;
          writeFileSync(configFile, defaultConfig);
        }

        await execa(editor, [configFile], { stdio: 'inherit' });
        console.log(chalk.green('✅ Configuration saved'));
      } else {
        console.log(chalk.cyan('📋 Configuration Manager'));
        console.log('');
        console.log('Usage:');
        console.log('  monkon config --list          List all configurations');
        console.log('  monkon config --get <key>     Get a specific value');
        console.log('  monkon config --edit          Edit configuration file');
      }
    } catch (error) {
      console.error(chalk.red('❌ Error managing configuration:'), error.message);
      process.exit(1);
    }
  });

export default config;

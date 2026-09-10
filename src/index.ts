#!/usr/bin/env node
import { Command } from 'commander';
import { searchCommand } from './commands/search.js';
import { scanCommand } from './commands/scan.js';
import { peekCommand } from './commands/peek.js';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { updateCommand } from './commands/update.js';
import { log } from './utils/logger.js';

const program = new Command();

program
  .name('skillgear')
  .description('The intelligent, offline-first skill engine for AI coding agents.')
  .version('0.1.0');

program
  .command('search <query>')
  .description('Search skills in the indexed catalog by name, tag, or description')
  .option('-l, --limit <number>', 'Maximum number of results to return', '15')
  .action((query, options) => {
    searchCommand(query, options);
  });

program
  .command('scan [dir]')
  .description('Detect stack technologies in the directory and recommend matching skills')
  .action((dir) => {
    scanCommand(dir || process.cwd());
  });

program
  .command('peek <skill>')
  .description('Preview a skill\'s SKILL.md without downloading or installing it')
  .action(async (skill) => {
    await peekCommand(skill);
  });

program
  .command('install <skill>')
  .description('Download and activate a skill for your AI agent')
  .option('-t, --target <ide>', 'Target agent/IDE: antigravity, cursor, claude, copilot, or auto', 'auto')
  .option('-g, --global', 'Install globally for the current user instead of workspace', false)
  .action(async (skill, options) => {
    await installCommand(skill, options);
  });

program
  .command('list')
  .description('List skills installed in the current workspace or globally')
  .option('-g, --global', 'List globally installed skills', false)
  .action((options) => {
    listCommand(options);
  });

program
  .command('update')
  .description('Fetch the latest skill catalog from GitHub')
  .action(async () => {
    await updateCommand();
  });

if (process.argv.length <= 2) {
  log.banner();
  program.outputHelp();
} else {
  program.parse(process.argv);
}

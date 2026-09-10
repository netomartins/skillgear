import chalk from 'chalk';
import { searchCatalog } from '../core/catalog.js';
import { log } from '../utils/logger.js';

export function searchCommand(query: string, options: { limit?: string }): void {
  const limit = options.limit ? parseInt(options.limit, 10) : 15;
  log.title('🔍 Searching skills for: ' + chalk.yellow(query));

  const results = searchCatalog(query, limit);

  if (results.length === 0) {
    log.warn('No skills found matching: ' + chalk.bold(query));
    log.dim('Try different keywords or run "skillgear scan" to auto-detect your stack.');
    return;
  }

  console.log(chalk.dim(`  Found ${results.length} matching skills:\n`));

  for (const { entry } of results) {
    const tags = entry.tags?.length ? chalk.dim(' [' + entry.tags.slice(0, 3).join(', ') + ']') : '';
    console.log(chalk.green('  ✔') + ' ' + chalk.bold.white(entry.name) + tags);
    if (entry.description) {
      console.log(chalk.dim('    ' + entry.description.slice(0, 110)));
    }
  }

  console.log('');
  log.dim('  💡 Run "skillgear peek <name>" to preview without installing.');
  log.dim('  💡 Run "skillgear install <name>" to activate in your workspace.');
}

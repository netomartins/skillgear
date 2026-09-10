import chalk from 'chalk';
import ora from 'ora';
import { mkdirSync, writeFileSync } from 'fs';
import { getSkillGearDir, getCatalogPath } from '../utils/paths.js';
import { getCatalogStats } from '../core/catalog.js';
import { log } from '../utils/logger.js';

export async function updateCommand(): Promise<void> {
  log.title('🔄 Updating SkillGear catalog...');

  const spinner = ora('Checking for latest catalog updates...').start();

  try {
    const catalogUrl = 'https://raw.githubusercontent.com/netomartins/skillgear/main/data/catalog.json';
    const response = await fetch(catalogUrl);

    if (!response.ok) {
      spinner.warn(chalk.yellow(`Remote update not yet published (HTTP ${response.status}). Using bundled catalog.`));
      const stats = getCatalogStats();
      console.log('');
      log.table('Total Skills:', chalk.bold(String(stats.total)));
      log.success('Bundled catalog is healthy and ready.');
      return;
    }

    const data = await response.text();
    JSON.parse(data);

    mkdirSync(getSkillGearDir(), { recursive: true });
    writeFileSync(getCatalogPath(), data, 'utf8');

    spinner.succeed(chalk.green('Catalog updated successfully!'));
    const stats = getCatalogStats();
    console.log('');
    log.table('Total Skills:', chalk.bold(String(stats.total)));
  } catch (err) {
    spinner.fail(chalk.red('Update failed.'));
    const message = err instanceof Error ? err.message : String(err);
    log.error(message);
  }
}

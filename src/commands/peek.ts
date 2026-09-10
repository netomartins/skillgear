import chalk from 'chalk';
import ora from 'ora';
import { findSkill } from '../core/catalog.js';
import { fetchSkillContent } from '../core/downloader.js';
import { log } from '../utils/logger.js';

export async function peekCommand(skillName: string): Promise<void> {
  const entry = findSkill(skillName);

  if (!entry) {
    log.error(`Skill "${skillName}" not found in catalog.`);
    log.dim('Run "skillgear search <query>" to find available skills.');
    process.exit(1);
  }

  const spinner = ora(`Fetching preview for ${chalk.bold(entry.name)}...`).start();

  try {
    const content = await fetchSkillContent(entry);
    spinner.stop();

    log.title(`⚡ Peek: ${chalk.yellow(entry.name)}`);
    console.log(chalk.dim('Source: ') + chalk.cyan(`https://github.com/${entry.source.repo}/tree/${entry.source.branch}/${entry.source.path}`));
    if (entry.tags?.length) {
      console.log(chalk.dim('Tags:   ') + entry.tags.join(', '));
    }
    console.log(chalk.dim('--------------------------------------------------'));

    const lines = content.split(/\r?\n/);
    const preview = lines.slice(0, 45).join('\n');
    console.log(preview);

    if (lines.length > 45) {
      console.log(chalk.dim(`\n... [${lines.length - 45} more lines omitted]`));
    }

    console.log(chalk.dim('--------------------------------------------------'));
    log.dim('To activate this skill in your project:');
    console.log(chalk.cyan(`  skillgear install ${entry.name}`));
  } catch (err) {
    spinner.fail(chalk.red('Failed to fetch skill content.'));
    const message = err instanceof Error ? err.message : String(err);
    log.error(message);
    process.exit(1);
  }
}

import chalk from 'chalk';
import ora from 'ora';
import { findSkill } from '../core/catalog.js';
import { activateSkill, type TargetIDE } from '../core/activator.js';
import { log } from '../utils/logger.js';

export interface InstallOptions {
  target?: string;
  global?: boolean;
}

export async function installCommand(skillName: string, options: InstallOptions): Promise<void> {
  const entry = findSkill(skillName);

  if (!entry) {
    log.error(`Skill "${skillName}" not found in catalog.`);
    log.dim('Run "skillgear search <query>" to find the correct skill name.');
    process.exit(1);
  }

  const targetIDE = (options.target || 'auto') as TargetIDE;
  const isGlobal = Boolean(options.global);
  const cwd = process.cwd();

  const spinner = ora(`Installing ${chalk.bold(entry.name)}...`).start();

  try {
    const result = await activateSkill(entry, cwd, targetIDE, isGlobal);
    spinner.succeed(chalk.green(`Installed ${chalk.bold(entry.name)} successfully!`));

    console.log('');
    log.table('Target IDE:', chalk.bold(result.ide.toUpperCase()));
    log.table('Location:', chalk.cyan(result.path));
    log.table('Scope:', isGlobal ? 'Global' : 'Project Local');
    console.log('');
    log.success('The skill is now ready for your AI agent to use.');
  } catch (err) {
    spinner.fail(chalk.red('Installation failed.'));
    const message = err instanceof Error ? err.message : String(err);
    log.error(message);
    process.exit(1);
  }
}

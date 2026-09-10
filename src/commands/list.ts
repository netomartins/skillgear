import chalk from 'chalk';
import { listInstalledSkills } from '../core/activator.js';
import { log } from '../utils/logger.js';

export function listCommand(options: { global?: boolean }): void {
  const isGlobal = Boolean(options.global);
  const cwd = process.cwd();

  log.title(isGlobal ? '📋 Globally Installed Skills' : '📋 Skills Installed in Current Workspace');

  const targets = listInstalledSkills(cwd, isGlobal);

  if (targets.length === 0) {
    log.warn(isGlobal ? 'No globally installed skills found.' : 'No skills installed in this workspace.');
    log.dim('Use "skillgear scan" to discover skills for this project, or "skillgear install <name>".');
    return;
  }

  for (const { ide, skills } of targets) {
    console.log(chalk.bold.cyan(`  [${ide.toUpperCase()}]`) + chalk.dim(` (${skills.length} skills):`));
    for (const s of skills) {
      console.log(chalk.green('    ✔ ') + chalk.white(s));
    }
    console.log('');
  }
}

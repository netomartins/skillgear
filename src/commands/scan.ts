import chalk from 'chalk';
import { scanProject } from '../core/detector.js';
import { log } from '../utils/logger.js';

export function scanCommand(dir: string): void {
  log.title('🔎 Scanning project stack in: ' + chalk.white(dir));

  const result = scanProject(dir);

  if (result.detections.length === 0) {
    log.warn('No supported project configurations detected in this directory.');
    log.dim('Make sure you are at the project root with package.json, requirements.txt, go.mod, etc.');
    return;
  }

  console.log(chalk.bold('  Detected Technologies:\n'));
  for (const d of result.detections) {
    const badge = d.confidence === 'high' ? chalk.green('●') : chalk.yellow('○');
    console.log(`  ${badge} ${chalk.bold.white(d.technology.padEnd(16))} ${chalk.dim('(' + d.source + ')')}`);
  }

  if (result.suggestions.length > 0) {
    console.log('');
    console.log(chalk.bold('  Recommended Skills for your Stack:\n'));

    for (const { entry } of result.suggestions.slice(0, 10)) {
      const tags = entry.tags?.length ? chalk.dim(' [' + entry.tags.slice(0, 3).join(', ') + ']') : '';
      console.log(chalk.cyan('  →') + ' ' + chalk.bold.white(entry.name) + tags);
      if (entry.description) {
        console.log(chalk.dim('    ' + entry.description.slice(0, 100)));
      }
    }

    console.log('');
    log.dim('  Run "skillgear install <name>" to add a skill to your project.');
  }
}

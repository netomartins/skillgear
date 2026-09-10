import chalk from 'chalk';

export const log = {
  info: (msg: string) => console.log(chalk.blue('ℹ') + ' ' + msg),
  success: (msg: string) => console.log(chalk.green('✔') + ' ' + msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠') + ' ' + msg),
  error: (msg: string) => console.error(chalk.red('✖') + ' ' + msg),
  dim: (msg: string) => console.log(chalk.dim(msg)),
  title: (msg: string) => console.log('\n' + chalk.bold.cyan(msg) + '\n'),
  table: (label: string, value: string) => {
    console.log(chalk.gray('  ' + label.padEnd(18)) + value);
  },
  banner: () => {
    console.log(chalk.bold.hex('#FF6B6B')('  ⚙️  SkillGear v0.1.0'));
    console.log(chalk.dim('  The intelligent, offline-first skill engine for AI coding agents\n'));
  }
};

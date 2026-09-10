import { homedir, platform } from 'os';
import { join } from 'path';
import { fileURLToPath } from 'url';

export const IS_WINDOWS = platform() === 'win32';

export function getHomeDir(): string {
  return homedir();
}

export function getSkillGearDir(): string {
  return join(homedir(), '.skillgear');
}

export function getCatalogPath(): string {
  return join(getSkillGearDir(), 'catalog.json');
}

export function getBundledCatalogPath(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return join(currentFile, '..', '..', '..', 'data', 'catalog.json');
}

export interface IDETarget {
  name: string;
  skillsDir: string;
}

export function getIDETargets(projectDir: string): IDETarget[] {
  return [
    { name: 'antigravity', skillsDir: join(projectDir, '.agents', 'skills') },
    { name: 'cursor', skillsDir: join(projectDir, '.cursor', 'skills') },
    { name: 'claude', skillsDir: join(projectDir, '.claude', 'skills') },
    { name: 'copilot', skillsDir: join(projectDir, '.github', 'skills') },
  ];
}

export function getGlobalIDETargets(): IDETarget[] {
  const home = homedir();
  return [
    { name: 'antigravity', skillsDir: join(home, '.agents', 'skills') },
    { name: 'cursor', skillsDir: join(home, '.cursor', 'skills') },
    { name: 'claude', skillsDir: join(home, '.claude', 'skills') },
  ];
}

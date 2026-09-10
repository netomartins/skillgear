import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import type { CatalogEntry } from './catalog.js';
import { downloadAndSaveSkill } from './downloader.js';
import { getIDETargets, getGlobalIDETargets } from '../utils/paths.js';

export type TargetIDE = 'antigravity' | 'cursor' | 'claude' | 'copilot' | 'auto';

export function detectActiveIDE(projectDir: string): string {
  const targets = getIDETargets(projectDir);
  for (const t of targets) {
    const folderName = '.' + (t.name === 'antigravity' ? 'agents' : t.name === 'copilot' ? 'github' : t.name);
    const parentDir = join(projectDir, folderName);
    if (existsSync(parentDir)) {
      return t.name;
    }
  }
  return 'antigravity';
}

export async function activateSkill(
  entry: CatalogEntry,
  projectDir: string,
  target: TargetIDE = 'auto',
  global = false,
): Promise<{ ide: string; path: string }> {
  let targetIDE = target;
  if (targetIDE === 'auto') {
    targetIDE = detectActiveIDE(projectDir) as TargetIDE;
  }

  const targets = global ? getGlobalIDETargets() : getIDETargets(projectDir);
  const ideTarget = targets.find(t => t.name === targetIDE);

  if (!ideTarget) {
    throw new Error(`Unknown target IDE: "${target}". Supported: antigravity, cursor, claude, copilot`);
  }

  mkdirSync(ideTarget.skillsDir, { recursive: true });
  const savedPath = await downloadAndSaveSkill(entry, ideTarget.skillsDir);

  return {
    ide: ideTarget.name,
    path: savedPath,
  };
}

export function listInstalledSkills(projectDir: string, global = false): { ide: string; skills: string[] }[] {
  const targets = global ? getGlobalIDETargets() : getIDETargets(projectDir);
  const result: { ide: string; skills: string[] }[] = [];

  for (const target of targets) {
    if (existsSync(target.skillsDir)) {
      try {
        const entries = readdirSync(target.skillsDir, { withFileTypes: true });
        const skills = entries.filter(e => e.isDirectory()).map(e => e.name);
        if (skills.length > 0) {
          result.push({ ide: target.name, skills });
        }
      } catch {}
    }
  }

  return result;
}

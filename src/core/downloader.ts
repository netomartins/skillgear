import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { CatalogEntry } from './catalog.js';

export async function fetchSkillContent(entry: CatalogEntry): Promise<string> {
  const { repo, path: skillPath, branch } = entry.source;
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${skillPath}/SKILL.md`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch skill "${entry.name}" from ${url} (HTTP ${response.status}: ${response.statusText})`);
  }

  return await response.text();
}

export async function downloadAndSaveSkill(entry: CatalogEntry, targetDir: string): Promise<string> {
  const skillDir = join(targetDir, entry.name);
  mkdirSync(skillDir, { recursive: true });

  const content = await fetchSkillContent(entry);
  const targetFile = join(skillDir, 'SKILL.md');
  writeFileSync(targetFile, content, 'utf8');

  return skillDir;
}

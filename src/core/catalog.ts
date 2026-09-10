import { readFileSync, existsSync } from 'fs';
import { getBundledCatalogPath, getSkillGearDir } from '../utils/paths.js';
import { join } from 'path';

export interface SkillSource {
  repo: string;
  path: string;
  branch: string;
}

export interface CatalogEntry {
  name: string;
  description: string;
  tags: string[];
  category: string;
  source: SkillSource;
  hasScripts: boolean;
  hasReferences: boolean;
}

let cachedCatalog: CatalogEntry[] | null = null;

export function loadCatalog(): CatalogEntry[] {
  if (cachedCatalog) return cachedCatalog;

  const localPath = join(getSkillGearDir(), 'catalog.json');
  const bundledPath = getBundledCatalogPath();

  let catalogPath = '';
  if (existsSync(localPath)) {
    catalogPath = localPath;
  } else if (existsSync(bundledPath)) {
    catalogPath = bundledPath;
  } else {
    throw new Error('Catalog not found. Run "skillgear update" or reinstall skillgear.');
  }

  const raw = readFileSync(catalogPath, 'utf8').replace(/^﻿/, '');
  cachedCatalog = JSON.parse(raw) as CatalogEntry[];
  return cachedCatalog;
}

export interface SearchResult {
  entry: CatalogEntry;
  score: number;
}

export function searchCatalog(query: string, limit = 15): SearchResult[] {
  const catalog = loadCatalog();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const entry of catalog) {
    const name = entry.name.toLowerCase();
    const desc = (entry.description || '').toLowerCase();
    const tags = (entry.tags || []).map(t => t.toLowerCase());
    const category = (entry.category || '').toLowerCase();

    let score = 0;
    for (const term of terms) {
      if (name === term) {
        score += 15;
      } else if (name.startsWith(term)) {
        score += 8;
      } else if (name.includes(term)) {
        score += 5;
      }

      if (tags.includes(term)) {
        score += 4;
      } else if (tags.some(t => t.includes(term))) {
        score += 2;
      }

      if (category === term) {
        score += 3;
      }

      if (desc.includes(term)) {
        score += 1;
      }
    }

    if (score > 0) {
      results.push({ entry, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function findSkill(name: string): CatalogEntry | undefined {
  const catalog = loadCatalog();
  const q = name.toLowerCase().trim();
  return catalog.find(e => e.name.toLowerCase() === q);
}

export function getCatalogStats(): { total: number; categories: Record<string, number> } {
  const catalog = loadCatalog();
  const categories: Record<string, number> = {};
  for (const entry of catalog) {
    const cat = entry.category || 'other';
    categories[cat] = (categories[cat] || 0) + 1;
  }
  return { total: catalog.length, categories };
}

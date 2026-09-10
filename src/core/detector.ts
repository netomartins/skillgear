import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { searchCatalog, type SearchResult } from './catalog.js';

export interface StackDetection {
  technology: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
}

export interface ScanResult {
  detections: StackDetection[];
  suggestions: SearchResult[];
}

export function scanProject(projectDir: string): ScanResult {
  const detections: StackDetection[] = [];

  // package.json
  const pkgPath = join(projectDir, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const content = readFileSync(pkgPath, 'utf8').replace(/^﻿/, '');
      const pkg = JSON.parse(content);
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      const depNames = Object.keys(allDeps);

      const depMap: Record<string, string> = {
        'next': 'nextjs',
        'react': 'react',
        'vue': 'vue',
        'svelte': 'svelte',
        'angular': 'angular',
        'express': 'express',
        'fastify': 'fastify',
        'tailwindcss': 'tailwind',
        'prisma': 'prisma',
        '@prisma/client': 'prisma',
        'drizzle-orm': 'drizzle',
        'typescript': 'typescript',
        'commander': 'cli',
        'yargs': 'cli',
        'jest': 'jest',
        'vitest': 'vitest',
        'playwright': 'playwright',
        'cypress': 'cypress',
        '@supabase/supabase-js': 'supabase',
        'firebase': 'firebase',
        'stripe': 'stripe',
        'mongoose': 'mongodb',
        'pg': 'postgres',
        'redis': 'redis',
        'graphql': 'graphql',
        '@apollo/server': 'graphql',
        'trpc': 'trpc',
        '@trpc/server': 'trpc',
        'socket.io': 'websocket',
        'three': 'threejs',
        'electron': 'electron',
        'react-native': 'react-native',
        'expo': 'expo',
        'astro': 'astro',
        'nuxt': 'nuxt',
        'shadcn-ui': 'shadcn',
        '@radix-ui/react-dialog': 'radix',
        'zustand': 'zustand',
        'redux': 'redux',
        'mobx': 'mobx'
      };

      for (const dep of depNames) {
        const normalized = dep.toLowerCase();
        for (const [key, tech] of Object.entries(depMap)) {
          if (normalized === key || normalized.startsWith(key + '/')) {
            detections.push({ technology: tech, confidence: 'high', source: 'package.json' });
          }
        }
      }
    } catch {}
  }

  // requirements.txt / pyproject.toml
  const reqPath = join(projectDir, 'requirements.txt');
  if (existsSync(reqPath)) {
    detections.push({ technology: 'python', confidence: 'high', source: 'requirements.txt' });
    try {
      const content = readFileSync(reqPath, 'utf8').toLowerCase();
      if (content.includes('django')) detections.push({ technology: 'django', confidence: 'high', source: 'requirements.txt' });
      if (content.includes('fastapi')) detections.push({ technology: 'fastapi', confidence: 'high', source: 'requirements.txt' });
      if (content.includes('flask')) detections.push({ technology: 'flask', confidence: 'high', source: 'requirements.txt' });
      if (content.includes('pytorch') || content.includes('torch')) detections.push({ technology: 'pytorch', confidence: 'high', source: 'requirements.txt' });
      if (content.includes('tensorflow')) detections.push({ technology: 'tensorflow', confidence: 'high', source: 'requirements.txt' });
    } catch {}
  }

  if (existsSync(join(projectDir, 'pyproject.toml'))) {
    detections.push({ technology: 'python', confidence: 'high', source: 'pyproject.toml' });
  }

  // go.mod
  if (existsSync(join(projectDir, 'go.mod'))) {
    detections.push({ technology: 'go', confidence: 'high', source: 'go.mod' });
    try {
      const content = readFileSync(join(projectDir, 'go.mod'), 'utf8').toLowerCase();
      if (content.includes('gin-gonic')) detections.push({ technology: 'gin', confidence: 'high', source: 'go.mod' });
      if (content.includes('labstack/echo')) detections.push({ technology: 'echo', confidence: 'high', source: 'go.mod' });
    } catch {}
  }

  // Cargo.toml
  if (existsSync(join(projectDir, 'Cargo.toml'))) {
    detections.push({ technology: 'rust', confidence: 'high', source: 'Cargo.toml' });
  }

  // Docker
  if (existsSync(join(projectDir, 'Dockerfile')) || existsSync(join(projectDir, 'docker-compose.yml')) || existsSync(join(projectDir, 'docker-compose.yaml'))) {
    detections.push({ technology: 'docker', confidence: 'high', source: 'Dockerfile' });
  }

  // Terraform
  if (existsSync(join(projectDir, 'main.tf')) || existsSync(join(projectDir, 'terraform'))) {
    detections.push({ technology: 'terraform', confidence: 'high', source: '*.tf' });
  }

  // GitHub Actions
  if (existsSync(join(projectDir, '.github', 'workflows'))) {
    detections.push({ technology: 'github-actions', confidence: 'medium', source: '.github/workflows/' });
  }

  // Supabase
  if (existsSync(join(projectDir, 'supabase'))) {
    detections.push({ technology: 'supabase', confidence: 'high', source: 'supabase/' });
  }

  // Deduplicate detections
  const seen = new Set<string>();
  const uniqueDetections = detections.filter(d => {
    if (seen.has(d.technology)) return false;
    seen.add(d.technology);
    return true;
  });

  // Search catalog for each detected technology
  const allSuggestions: SearchResult[] = [];
  const seenSkills = new Set<string>();

  for (const detection of uniqueDetections) {
    const results = searchCatalog(detection.technology, 5);
    for (const r of results) {
      if (!seenSkills.has(r.entry.name)) {
        seenSkills.add(r.entry.name);
        allSuggestions.push(r);
      }
    }
  }

  allSuggestions.sort((a, b) => b.score - a.score);

  return {
    detections: uniqueDetections,
    suggestions: allSuggestions.slice(0, 20),
  };
}

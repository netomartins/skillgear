import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const home = homedir();
const agentsCatalogPath = join(home, '.agents', 'catalog.json');
const lockPath = join(home, '.agents', '.skill-lock.json');
const skillsDir = join(home, '.agents', 'skills');
const outCatalogPath = join(process.cwd(), 'data', 'catalog.json');

if (!existsSync(agentsCatalogPath)) {
  console.error('Source catalog not found at:', agentsCatalogPath);
  process.exit(1);
}

const rawCat = JSON.parse(readFileSync(agentsCatalogPath, 'utf8').replace(/^\uFEFF/, ''));
let lockData: Record<string, any> = {};
try {
  lockData = JSON.parse(readFileSync(lockPath, 'utf8').replace(/^\uFEFF/, ''));
} catch {}
const locked = lockData.skills || {};

const placeholderDesc = 'one sentence what this skill does and when to invoke it';

function getCategoryAndTags(name: string, desc: string) {
  const text = (name + ' ' + (desc || '')).toLowerCase();
  const tags = new Set<string>();
  let category = 'general';

  if (/next|react|vue|svelte|angular|frontend|tailwind|css|html|ui|ux|radix|shadcn|astro|nuxt/.test(text)) {
    category = 'frontend';
    if (text.includes('next')) tags.add('nextjs');
    if (text.includes('react')) tags.add('react');
    if (text.includes('vue')) tags.add('vue');
    if (text.includes('tailwind')) tags.add('tailwind');
    if (text.includes('ui') || text.includes('ux')) tags.add('ui-ux');
  } else if (/python|django|fastapi|flask|torch|pytorch|tensorflow|pandas|numpy/.test(text)) {
    category = 'python';
    tags.add('python');
    if (text.includes('fastapi')) tags.add('fastapi');
    if (text.includes('django')) tags.add('django');
    if (text.includes('flask')) tags.add('flask');
    if (text.includes('torch')) tags.add('pytorch');
  } else if (/docker|kubernetes|k8s|terraform|ansible|devops|ci\/cd|pipeline|aws|gcp|azure|cloudflare/.test(text)) {
    category = 'devops';
    tags.add('devops');
    if (text.includes('docker')) tags.add('docker');
    if (text.includes('kubernetes') || text.includes('k8s')) tags.add('kubernetes');
    if (text.includes('aws')) tags.add('aws');
    if (text.includes('gcp')) tags.add('gcp');
    if (text.includes('terraform')) tags.add('terraform');
  } else if (/database|sql|postgres|mysql|mongo|prisma|drizzle|redis|supabase|sqlite/.test(text)) {
    category = 'database';
    tags.add('database');
    if (text.includes('postgres')) tags.add('postgres');
    if (text.includes('prisma')) tags.add('prisma');
    if (text.includes('supabase')) tags.add('supabase');
    if (text.includes('redis')) tags.add('redis');
    if (text.includes('mongo')) tags.add('mongodb');
  } else if (/test|jest|vitest|playwright|cypress|mock|tdd/.test(text)) {
    category = 'testing';
    tags.add('testing');
    if (text.includes('playwright')) tags.add('playwright');
    if (text.includes('jest')) tags.add('jest');
    if (text.includes('cypress')) tags.add('cypress');
  } else if (/security|auth|jwt|oauth|crypto|audit|vulnerability/.test(text)) {
    category = 'security';
    tags.add('security');
    if (text.includes('auth')) tags.add('auth');
  } else if (/ai|llm|rag|prompt|agent|openai|claude|anthropic|langchain|ollama|embedding/.test(text)) {
    category = 'ai-ml';
    tags.add('ai');
    tags.add('agents');
    if (text.includes('rag')) tags.add('rag');
    if (text.includes('prompt')) tags.add('prompt-engineering');
  } else if (/api|rest|graphql|trpc|grpc|websocket|backend|node|express|fastify|go|rust/.test(text)) {
    category = 'backend';
    tags.add('backend');
    if (text.includes('graphql')) tags.add('graphql');
    if (text.includes('trpc')) tags.add('trpc');
    if (text.includes('go')) tags.add('golang');
    if (text.includes('rust')) tags.add('rust');
  } else if (/doc|markdown|documentation|readme|changelog|git|github/.test(text)) {
    category = 'productivity';
    tags.add('productivity');
  }

  name.split(/[-_]/).forEach(w => {
    if (w.length > 2 && !['and', 'for', 'the', 'with'].includes(w)) {
      tags.add(w.toLowerCase());
    }
  });

  return { category, tags: Array.from(tags).slice(0, 6) };
}

const finalCatalog = [];
for (const item of rawCat) {
  const name = item.name;
  const desc = (item.description || '').trim();

  if (desc.toLowerCase().includes(placeholderDesc)) continue;

  const skillFolder = join(skillsDir, name);
  const skillMd = join(skillFolder, 'SKILL.md');
  if (existsSync(skillFolder) && !existsSync(skillMd)) continue;

  const hasScripts = existsSync(join(skillFolder, 'scripts'));
  const hasReferences = existsSync(join(skillFolder, 'references'));

  let repo = 'VoltAgent/awesome-agent-skills';
  let skillPath = 'skills/' + name;
  let branch = 'main';

  if (locked[name] && locked[name].source && locked[name].source.includes('/')) {
    repo = locked[name].source;
  }

  const { category, tags } = getCategoryAndTags(name, desc);

  finalCatalog.push({
    name,
    description: desc,
    tags,
    category,
    source: { repo, path: skillPath, branch },
    hasScripts,
    hasReferences,
  });
}

writeFileSync(outCatalogPath, JSON.stringify(finalCatalog, null, 2), 'utf8');
console.log('Generated catalog with', finalCatalog.length, 'entries.');

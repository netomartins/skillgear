---
name: skillgear
description: Intelligent skill manager and discovery engine for AI coding agents. Use when the user asks for best practices, frameworks, libraries, tools, or when you need specialized knowledge for Next.js, Docker, Python, PostgreSQL, Testing, etc.
---

# SkillGear — AI Agent Meta-Skill

SkillGear gives AI agents instant access to an indexed catalog of 1,700+ curated agent skills, with stack auto-detection, zero-footprint peeking, and multi-IDE activation.

## When to Invoke

Invoke this skill whenever:
- You need deep, framework-specific best practices (e.g. Next.js App Router, Supabase, Tailwind, Vitest).
- You start working on a project and want to discover the optimal skills for its stack.
- The user asks for a skill, workflow guide, or architectural pattern.

## CLI Commands Reference

```bash
# 1. Search for skills by technology or topic
npx skillgear search "<query>"

# 2. Auto-detect project tech stack and recommend skills
npx skillgear scan

# 3. Read/preview a skill without installing it (zero-footprint)
npx skillgear peek <skill-name>

# 4. Install a skill into the workspace (.agents/skills, .cursor/skills, etc.)
npx skillgear install <skill-name>

# 5. List currently installed skills
npx skillgear list
```

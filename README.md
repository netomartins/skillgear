# SkillGear ⚙️

> **The intelligent, offline-first skill engine for AI coding agents.**  
> Instantly search, scan, peek, and activate from **1,700+ curated agent skills** directly inside your workspace.

[![npm version](https://img.shields.io/npm/v/skillgear.svg?style=flat-square&color=CB3837)](https://www.npmjs.com/package/skillgear)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node: >=18](https://img.shields.io/badge/node->=18.0.0-blue.svg?style=flat-square)](https://nodejs.org)

---

## ✨ Features

- 🔍 **Instant Search**: Search through 1,700+ indexed skills with weighted relevance scoring.
- 🔎 **Stack Auto-Detection (`scan`)**: Analyzes `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `Dockerfile`, etc., and suggests matching skills automatically.
- ⚡ **Zero-Footprint Preview (`peek`)**: Preview any skill's instructions on demand without saving files to disk.
- 🎯 **Multi-IDE & Agent Support**: Automatically detects and activates skills for **Antigravity** (`.agents/skills`), **Cursor** (`.cursor/skills`), **Claude Code** (`.claude/skills`), and **Copilot**.
- 🪶 **Ultra Lightweight**: Under 1.5MB total package size. Does not bloat your repository with megabytes of markdown files.

---

## 🚀 Quick Start (No Install Needed)

Run directly with `npx`:

```bash
# Auto-detect your project stack & recommend skills
npx skillgear scan

# Search for skills
npx skillgear search "nextjs auth"

# Preview a skill before installing
npx skillgear peek nextjs-app-router-patterns

# Install a skill into your project
npx skillgear install nextjs-app-router-patterns
```

Or install globally:

```bash
npm install -g skillgear
```

---

## 🛠️ CLI Commands

### 1. `skillgear search <query>`
Searches the bundled indexed catalog by skill name, tags, category, or description.

```bash
skillgear search "tailwind"
skillgear search "postgres prisma" --limit 10
```

### 2. `skillgear scan [dir]`
Inspects dependencies and configurations in the current directory and recommends the best skills for your stack.

```bash
skillgear scan
```

### 3. `skillgear peek <skill>`
Fetches and previews the `SKILL.md` instructions straight from the upstream source without modifying your workspace.

```bash
skillgear peek test-driven-development
```

### 4. `skillgear install <skill>`
Downloads the skill from its original repository and places it in the appropriate skills directory for your agent.

```bash
# Auto-detect target IDE (Antigravity / Cursor / Claude)
skillgear install react-ui-patterns

# Target a specific agent/IDE
skillgear install react-ui-patterns --target cursor
skillgear install react-ui-patterns --target claude

# Install globally in your user profile
skillgear install react-ui-patterns --global
```

### 5. `skillgear list`
Lists all skills currently installed in the workspace or globally.

```bash
skillgear list
skillgear list --global
```

### 6. `skillgear update`
Checks for and downloads catalog updates from GitHub.

```bash
skillgear update
```

---

## 🤖 Supported Agents & IDEs

| Agent / IDE | Local Target Directory | Global Target Directory |
|---|---|---|
| **Google Antigravity** | `.agents/skills/<name>/` | `~/.agents/skills/<name>/` |
| **Cursor** | `.cursor/skills/<name>/` | `~/.cursor/skills/<name>/` |
| **Claude Code** | `.claude/skills/<name>/` | `~/.claude/skills/<name>/` |
| **GitHub Copilot** | `.github/skills/<name>/` | — |

---

## 📄 License & Attribution

MIT License © [Neto Martins](https://github.com/netomartins).

Skills indexed in the catalog are sourced from original open-source repositories including [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills), [anthropics/skills](https://github.com/anthropics/skills), [vercel-labs](https://github.com/vercel-labs), and [obra/superpowers](https://github.com/obra/superpowers). See [ATTRIBUTION.md](ATTRIBUTION.md) for details.

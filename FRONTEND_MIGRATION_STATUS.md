# Frontend Migration Status

Last updated: 2026-04-04

## Purpose

This file records the current state of the frontend migration toward Ant Design.
Any AI agent continuing frontend work in this repository should read this file before making new UI decisions.
The detailed working checklist lives in `FRONTEND_MIGRATION_TODO.md`.

## Current Decision

The project is moving to Ant Design as the primary UI library.

This means:

- New UI work should prefer Ant Design components.
- Existing screens should be migrated toward Ant Design gradually.
- Tailwind is no longer part of the target architecture and should be removed over time.
- New Mantine-based UI, new Radix primitive wrappers, or new custom base UI primitives should not be introduced unless explicitly requested.

## What Has Been Completed

### 1. Project rules were updated

- `FRONTEND_RULES.md` now states that Ant Design is the standard UI direction for future frontend work.
- `AGENTS.md` now instructs agents to use Ant Design as the primary UI source of truth.

### 2. Ant Design knowledge access was configured

- A project-scoped Codex MCP config was added at `.codex/config.toml`.
- The configured MCP server name is `antd`.
- The MCP setup is version-pinned to Ant Design CLI `6.3.5` and Ant Design docs/version `6.3.5`.

Current MCP configuration:

```toml
[mcp_servers.antd]
command = "npx"
args = ["-y", "@ant-design/cli@6.3.5", "mcp", "--version", "6.3.5"]
startup_timeout_sec = 20
tool_timeout_sec = 60
required = true
```

### 3. Ant Design package was installed

- `antd` was added to `package.json`.
- Installed version: `6.3.5`

### 4. Foundation setup has started

- `src/main.tsx` now wraps the app with Ant Design `ConfigProvider` and Ant Design `App`.
- `src/theme/antdTheme.ts` was created.
- Existing brand color, typography, radius, and base surface decisions were mapped into Ant Design theme tokens.
- The current localStorage-based dark mode flag is temporarily preserved and mapped into the Ant Design theme algorithm.
- `MantineProvider` is still kept temporarily inside the Ant Design providers because the visual search flow still depends on Mantine.
- A production build succeeded after the provider and theme setup changes.

## What Is Not Done Yet

The migration has started, but only the foundation layer has been wired.

At the time of this note:

- Auth pages have not yet been migrated to Ant Design.
- Layout shell components have not yet been migrated to Ant Design.
- Mantine is still present, especially in the visual search flow.
- Tailwind is still present and must be phased out during the migration.
- Existing custom `src/components/ui` primitives are still present.
- Global styling cleanup around Ant Design has not yet been completed.

## Current Codebase Reality

The codebase currently mixes multiple UI approaches:

- Tailwind CSS
- custom UI primitives built around Radix
- Mantine in some flows

Ant Design has now been installed and wired into the app root.
Tailwind remains in the current codebase only as legacy implementation that should be removed, not expanded.
Ant Design is now wired into the app root, but the route-level UI is still largely legacy.

## Recommended Next Steps

Follow this order unless the user explicitly changes direction:

1. Finish global styling cleanup around the Ant Design provider and theme setup
2. Migrate auth screens to Ant Design
3. Migrate layout shell components such as header, sidebar, and navigation
4. Migrate dashboard, feed, profile, and settings screens
5. Migrate visual search and remove Mantine usage
6. Remove remaining Tailwind usage, Tailwind configuration, and Tailwind dependencies when safe
7. Remove unused custom UI primitives and old UI dependencies when safe

## MCP And Docs Usage Policy

For Ant Design-related work, agents should use sources in this order:

1. The `antd` MCP server
2. `https://ant.design/llms-full.txt`
3. `https://ant.design/llms-semantic.md`
4. `https://ant.design/llms.txt`
5. `https://ant.design/components/<component>.md`
6. `https://ant.design/components/<component>/semantic.md`

Use MCP first for:

- component selection
- props and API lookup
- design tokens
- semantic structure
- demos and examples
- changelog and version checks

## Important Working Notes

- There were already unrelated local changes in the repository when this migration setup work was done.
- Do not assume the current git worktree is clean.
- Do not revert unrelated user changes while continuing the migration.

## Quick Resume Note For Future Agents

Before continuing frontend work:

1. Read `FRONTEND_RULES.md`
2. Read `AGENTS.md`
3. Read this file
4. Read `FRONTEND_MIGRATION_TODO.md`
5. Use the `antd` MCP server first
6. Update the todo file by crossing out completed tasks
7. Continue from the next unchecked item in `FRONTEND_MIGRATION_TODO.md`

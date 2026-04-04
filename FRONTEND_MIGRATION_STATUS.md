# Frontend Migration Status

Last updated: 2026-04-05

## Purpose

This file records the current state of the frontend migration toward Ant Design.
Any AI agent continuing frontend work in this repository should read this file before making new UI decisions.
The detailed working checklist lives in `FRONTEND_MIGRATION_TODO.md`.

## Current Decision

The project is moving to Ant Design as the primary UI library.
The implementation strategy is now route-level rewrites instead of hybrid primitive swaps inside already messy screens.

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

### 4. Foundation setup is complete

- `src/main.tsx` now wraps the app with Ant Design `ConfigProvider` and Ant Design `App`.
- `src/theme/antdTheme.ts` was created.
- Existing brand color, typography, radius, and base surface decisions were mapped into Ant Design theme tokens.
- The current localStorage-based dark mode flag is temporarily preserved and mapped into the Ant Design theme algorithm.
- `MantineProvider` is still kept temporarily inside the Ant Design providers because the visual search flow still depends on Mantine.
- `src/main.tsx` now loads Ant Design `reset.css` after the legacy global stylesheet so Ant Design base element rules can win over legacy preflight defaults during migration.
- `src/index.css` no longer applies a universal border-color override to every element.
- The `.ant-app` wrapper now owns the app-level minimum height and base background/text colors.
- A production build succeeded after the provider and theme setup changes.

### 5. App shell migration is implemented in code

- `src/components/layout/AppLayout.tsx` now uses Ant Design `Layout` primitives for the shell container and content area.
- `src/components/layout/Header.tsx` was refactored to Ant Design `Layout.Header`, `Button`, and `Avatar`.
- `src/components/layout/Sidebar.tsx` was refactored to Ant Design `Layout.Sider`, `Menu`, `Button`, `Divider`, and `Avatar`.
- `src/components/layout/MobileNav.tsx` now uses Ant Design `Drawer`, `Button`, `Menu`, `Avatar`, and `Grid.useBreakpoint`.
- `src/components/layout/NotificationsMenu.tsx` no longer uses the custom Radix dropdown stack and now uses Ant Design `Popover`, `Badge`, and `Button`.
- Shared shell navigation config now lives in `src/components/layout/shellNavigation.ts`.
- A production build succeeded after the shell refactor.

### 6. Auth migration is implemented in code

- `src/components/layout/AuthLayout.tsx` now uses Ant Design `Layout`, `Card`, `Grid`, and `Typography` instead of the old Tailwind-based split auth shell.
- `src/components/layout/AuthHeroPanel.tsx` was added to keep the auth shell hero panel within the project line-limit rule while still using Ant Design composition.
- `src/pages/Auth/LoginPage.tsx` now uses Ant Design `Form`, `Input`, `Input.Password`, `Button`, and `Alert`.
- `src/pages/Auth/RegisterPage.tsx` now uses Ant Design `Form`, `Input`, `Select`, `Button`, `Alert`, `Row`, and `Col` while preserving `react-hook-form` and `zod`.
- `src/pages/Auth/ForgotPasswordPage.tsx` now uses Ant Design `Form`, `Input`, `Button`, `Alert`, and `Result`.
- Shared auth page title/footer composition now lives in `src/pages/Auth/AuthPageParts.tsx`.
- The auth flow no longer depends on custom `src/components/ui` primitives.
- A production build succeeded after the auth refactor.

### 7. Dashboard route is rewritten in code

- `src/pages/Dashboard/DashboardPage.tsx` was rewritten around Ant Design `Row`, `Col`, `Flex`, `Alert`, `Button`, and `Typography`.
- `src/pages/Dashboard/components/DashboardStatCard.tsx` now uses Ant Design `Card` and `Statistic`.
- `src/pages/Dashboard/components/DashboardUpcomingEventsCard.tsx` now uses Ant Design `Card`, `Spin`, `Empty`, `Alert`, `Tag`, and `Button`.
- `src/pages/Dashboard/components/DashboardRecentPostsCard.tsx` was added for a clean Ant Design-based recent-posts panel.
- `src/pages/Dashboard/components/DashboardHighlightsColumn.tsx` was added for the visual search, discounts, and AI assistant surfaces.
- The dashboard slice no longer depends on custom `src/components/ui` primitives or Tailwind utility classes.
- A production build succeeded after the dashboard rewrite.

### 8. Explore route is rewritten in code

- `src/pages/Explore/ExplorePage.tsx` now uses an Ant Design `Tabs` based route structure instead of the older segmented-only switching pattern.
- `src/pages/Explore/components/ExploreTabs.tsx` now uses Ant Design `Tabs` with `tabBarExtraContent` so search and create actions can live inside the route navigation.
- `src/pages/Explore/components/ExploreFilterBar.tsx` was added to provide Ant Design-based category, sort, status, and date filtering.
- `src/pages/Explore/components/EventCard.tsx` and `GroupCard.tsx` were refactored toward stronger Ant Design card composition and cleaner status/action hierarchy.
- `src/pages/Explore/components/EventDetailDialog.tsx` and `GroupDetailDialog.tsx` now use Ant Design `Drawer` so users can inspect details without losing list context.
- `src/pages/Explore/components/ExploreEventTimelineCard.tsx` was added to give the event view a simple Ant Design timeline rail for upcoming items.
- `src/pages/Explore/components/CreateEventDialog.tsx` now uses Ant Design `DatePicker.RangePicker` instead of browser-native datetime inputs.
- Loading and empty states across the explore grid now use Ant Design skeleton and empty compositions more consistently.
- `src/pages/Explore/exploreMockData.ts`, `src/pages/Explore/useExplorePreviewState.ts`, and `src/pages/Explore/components/ExploreDiscountGrid.tsx` now provide mock-filled preview content for groups, events, and discounts when live data is sparse or unavailable.
- Explore preview items can still be opened in the drawer and support local create/join/register interactions so the route can be evaluated visually before backend data is ready.
- A production build succeeded after the explore rewrite.

## What Is Not Done Yet

The migration has started, but only the foundation layer has been wired.

At the time of this note:

- Desktop and mobile browser-level validation of the new shell is still pending.
- Browser-level validation of auth validation, loading, and error states is still pending.
- Feed, explore, and visual search still need browser-level validation on their rewritten Ant Design flows.
- Profile and settings still need route-level migration completion.
- Tailwind is still present and must be phased out during the migration.
- Existing custom `src/components/ui` primitives are still present.

## Current Codebase Reality

The codebase currently mixes multiple UI approaches:

- Tailwind CSS
- custom UI primitives built around Radix
- Mantine in some flows

Ant Design has now been installed and wired into the app root.
Tailwind remains in the current codebase only as legacy implementation that should be removed, not expanded.
Ant Design is now wired into the app root, and the app shell, auth flow, dashboard route, explore route, and visual search route are migrated in code.
Feed, profile, and settings still need migration or browser-level follow-up work.

## Recommended Next Steps

Follow this order unless the user explicitly changes direction:

1. Validate desktop layout behavior and mobile navigation behavior for the new shell
2. Validate auth validation, loading, success, and error states in the browser
3. Validate the rewritten feed and explore interactions in the browser
4. Rewrite profile and settings around Ant Design while keeping their backend contracts unchanged
5. Rewrite visual search and remove Mantine usage
6. Remove remaining Tailwind usage, Tailwind configuration, and old custom UI primitives when safe

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

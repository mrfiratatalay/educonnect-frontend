# Frontend Migration Todo

Last updated: 2026-04-04

This file is the working checklist for the Ant Design migration.
When a task is completed, mark it by crossing it out with Markdown strikethrough.
Do not silently finish work without updating this file.

## Operating Rules

- Read `FRONTEND_RULES.md`, `AGENTS.md`, and `FRONTEND_MIGRATION_STATUS.md` before continuing migration work.
- Use the `antd` MCP server first for Ant Design component, token, semantic, demo, and changelog decisions.
- Do not add new Tailwind-based UI.
- Move touched UI away from Tailwind when the scope remains reasonable.
- Keep `react-hook-form` and `zod` unless the user explicitly changes the form architecture.
- Update this file at the end of every meaningful migration task.

## Completed Setup

- ~~Decide that Ant Design is the target UI library~~
- ~~Decide that Tailwind is not part of the target architecture~~
- ~~Update `FRONTEND_RULES.md` to make Ant Design the binding frontend standard~~
- ~~Create `AGENTS.md` with Ant Design guidance~~
- ~~Configure project-scoped Codex MCP for Ant Design in `.codex/config.toml`~~
- ~~Set the MCP server name to `antd`~~
- ~~Pin the Ant Design MCP tooling to version `6.3.5`~~
- ~~Install `antd@6.3.5` in the frontend project~~
- ~~Create `FRONTEND_MIGRATION_STATUS.md` to preserve migration context~~

## Wave 1: Foundation

- ~~Add Ant Design app-level setup to `src/main.tsx`~~
- ~~Wrap the app with `ConfigProvider`~~
- ~~Wrap the app with Ant Design `App`~~
- ~~Decide whether `MantineProvider` is temporarily kept during migration or removed immediately~~
- ~~Create `src/theme/antdTheme.ts`~~
- ~~Move existing font, radius, and primary color decisions into Ant Design tokens~~
- ~~Define base tokens for background, border, text, and surface behavior~~
- ~~Decide dark mode strategy for the Ant Design migration~~
- [ ] Remove or neutralize global styling that conflicts with Ant Design defaults
- ~~Verify the app still boots after the provider and theme changes~~
- [ ] Update this todo after foundation work is complete

## Wave 2: App Shell

- [ ] Refactor `src/components/layout/AppLayout.tsx` around Ant Design layout primitives
- [ ] Refactor `src/components/layout/Header.tsx`
- [ ] Refactor `src/components/layout/Sidebar.tsx`
- [ ] Refactor `src/components/layout/MobileNav.tsx`
- [ ] Replace custom dropdown usage in shell components with Ant Design equivalents where appropriate
- [ ] Replace custom avatar and badge usage in shell components with Ant Design equivalents where appropriate
- [ ] Remove Tailwind-heavy layout styling from shell components
- [ ] Validate desktop layout behavior
- [ ] Validate mobile navigation behavior
- [ ] Update this todo after shell migration is complete

## Wave 3: Auth

- [ ] Refactor `src/pages/Auth/LoginPage.tsx` with Ant Design inputs, buttons, and form layout
- [ ] Refactor `src/pages/Auth/RegisterPage.tsx`
- [ ] Refactor `src/pages/Auth/ForgotPasswordPage.tsx`
- [ ] Keep `react-hook-form` and `zod` integrated with the new UI
- [ ] Remove custom `src/components/ui` dependencies from auth screens
- [ ] Remove Tailwind-based form styling from auth screens
- [ ] Verify validation states, loading states, and error messages
- [ ] Update this todo after auth migration is complete

## Wave 4: Dashboard, Profile, Settings

- [ ] Refactor `src/pages/Dashboard/DashboardPage.tsx`
- [ ] Refactor dashboard child components under `src/pages/Dashboard/components`
- [ ] Refactor `src/pages/Profile/ProfilePage.tsx`
- [ ] Refactor profile child components under `src/pages/Profile/components`
- [ ] Refactor `src/pages/Settings/SettingsPage.tsx`
- [ ] Replace custom card, tabs, badge, avatar, and button usage with Ant Design equivalents
- [ ] Remove Tailwind-heavy styling from these pages
- [ ] Update this todo after simple page migration is complete

## Wave 5: Feed

- [ ] Refactor `src/pages/Feed/FeedPage.tsx`
- [ ] Refactor feed child components under `src/pages/Feed/components`
- [ ] Replace post composer UI with Ant Design inputs and actions
- [ ] Replace comment UI with Ant Design-based composition
- [ ] Replace custom dialog/dropdown usage with Ant Design equivalents
- [ ] Remove Tailwind-heavy feed styling
- [ ] Verify interaction states for create, edit, comment, and navigation flows
- [ ] Update this todo after feed migration is complete

## Wave 6: Explore

- [ ] Refactor `src/pages/Explore/ExplorePage.tsx`
- [ ] Refactor `src/pages/Explore/components` if needed
- [ ] Remove custom tabs or filter primitives in favor of Ant Design components
- [ ] Remove Tailwind-heavy styling from explore views
- [ ] Update this todo after explore migration is complete

## Wave 7: Visual Search

- [ ] Refactor `src/pages/VisualSearch/VisualSearchPage.tsx`
- [ ] Refactor `src/pages/VisualSearch/components/SearchInputPanel.tsx`
- [ ] Refactor `src/pages/VisualSearch/components/SearchResults.tsx`
- [ ] Refactor `src/pages/VisualSearch/components/SearchResultDialog.tsx`
- [ ] Replace Mantine `Dropzone` usage with an Ant Design-based solution
- [ ] Replace Mantine layout and display components with Ant Design equivalents
- [ ] Remove Mantine usage from the visual search flow
- [ ] Verify image upload, preview, search, and result detail flows
- [ ] Update this todo after visual search migration is complete

## Wave 8: Dependency And Styling Cleanup

- [ ] Remove remaining Tailwind classes from touched screens
- [ ] Remove Tailwind usage from global styling where possible
- [ ] Remove unused custom primitives under `src/components/ui`
- [ ] Remove unused Radix dependencies
- [ ] Remove Mantine dependencies when no longer used
- [ ] Remove Tailwind dependencies and config when no longer used
- [ ] Simplify `src/index.css` so it reflects the final Ant Design-based architecture
- [ ] Run a full build and fix any migration regressions
- [ ] Update this todo after cleanup is complete

## Ongoing Documentation Tasks

- [ ] Update `FRONTEND_MIGRATION_STATUS.md` after each completed migration wave
- [ ] Keep `AGENTS.md` aligned with the actual migration strategy
- ~~Keep this todo file accurate by crossing out completed tasks~~

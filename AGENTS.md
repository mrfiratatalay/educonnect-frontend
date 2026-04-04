# Project Agents Guide

This repository is migrating to Ant Design as the primary UI library.

All agents working on this project must treat Ant Design as the default source of truth for UI implementation, component selection, styling direction, and accessibility-aware composition.

## MCP-First Rule

Always use the `antd` MCP server first for any Ant Design-related task without waiting for an explicit user instruction.

Before continuing any frontend migration or UI refactor work, read `FRONTEND_MIGRATION_STATUS.md` to understand the current migration state and previously completed setup.
Also read `FRONTEND_MIGRATION_TODO.md` and keep it updated by crossing out completed tasks after each meaningful migration step.

This includes:

- choosing the right Ant Design component
- checking component props and APIs
- reading official docs
- finding runnable examples
- checking tokens and theme values
- inspecting semantic structure, DOM parts, and styling hooks
- checking version-specific API changes

Use the `antd` MCP tools intentionally:

- `antd_list` to discover available components
- `antd_info` to inspect props and API details
- `antd_doc` to fetch complete component documentation
- `antd_demo` to inspect examples
- `antd_token` to query design tokens
- `antd_semantic` to inspect DOM structure and semantic hooks
- `antd_changelog` to verify version changes and breaking behavior

## Fallback References

If the `antd` MCP server is unavailable, insufficient for the question, or a direct document reference is still useful, fall back to these official Ant Design AI-friendly references:

- Index and navigation: `https://ant.design/llms.txt`
- Full component and API reference: `https://ant.design/llms-full.txt`
- Semantic and DOM-oriented reference: `https://ant.design/llms-semantic.md`

When working on a specific component, also consult the component-specific docs:

- Component docs pattern: `https://ant.design/components/<component>.md`
- Component semantic docs pattern: `https://ant.design/components/<component>/semantic.md`

Examples:

- `https://ant.design/components/button.md`
- `https://ant.design/components/button/semantic.md`
- `https://ant.design/components/form.md`
- `https://ant.design/components/form/semantic.md`
- `https://ant.design/components/table.md`
- `https://ant.design/components/table/semantic.md`

## Reference Priority

Use references in this order:

1. `antd` MCP tools for all Ant Design-related work.
2. `llms-full.txt` for API surface, props, examples, and standard usage.
3. `llms-semantic.md` when DOM structure, semantic parts, accessibility behavior, composition boundaries, or internal structure matters.
4. `llms.txt` when discovering relevant component pages or documentation paths.
5. `<component>.md` for the exact component being implemented.
6. `<component>/semantic.md` when that exact component's semantic structure matters.

## Project Rules

Agents must also follow the local project rules in `FRONTEND_RULES.md`.

Current stack reality:

- Tailwind CSS is still present in the codebase, but it is no longer part of the target architecture.
- Custom UI primitives based on Radix exist in `src/components/ui`.
- Mantine is still present in parts of the codebase during migration.

Migration direction:

- Ant Design is the primary UI system for all new UI work.
- Tailwind should be removed from the codebase over time and must not be expanded.
- Do not introduce new Mantine-based UI unless the user explicitly requests it.
- Do not introduce new Radix-based primitive UI wrappers if Ant Design already provides the component.
- Prefer replacing custom primitive usage with Ant Design during refactors that already touch the screen.
- Avoid mixing multiple UI systems inside the same screen unless a staged migration makes it necessary.
- Do not add new Tailwind classes or Tailwind-based component styling in newly written UI.

## Implementation Guidance

For new or refactored UI:

- Prefer Ant Design components directly over custom `Button`, `Input`, `Card`, `Dialog`, `Dropdown`, `Tabs`, `Tooltip`, `Avatar`, and similar primitives.
- Keep `react-hook-form` and `zod` for form state and validation unless the user asks for a different form architecture.
- Do not use Tailwind for new UI work.
- Replace existing Tailwind usage when touching a screen if the change stays reasonable in scope.
- Do not rebuild Ant Design components with Tailwind classes when the official Ant Design component already exists.
- Prefer Ant Design composition before inventing project-local abstractions.
- Create project-specific components only at the app level, such as page sections, domain cards, empty states, panels, and feature-specific composed blocks.
- If additional styling is needed beyond Ant Design, prefer small project-level CSS or theme/token work over Tailwind.

## Theme Guidance

Theme decisions should be centralized.

- Prefer a single Ant Design theme entry point such as `src/theme/antdTheme.ts`.
- Map the existing product visual language into Ant Design tokens rather than scattering one-off overrides.
- Preserve the current design language unless the user asks for a redesign.
- Avoid large inline style blocks when Ant Design tokens, theme config, or component props can express the same decision.

## Expected Workflow For UI Tasks

For any meaningful UI task, agents should:

1. Identify which Ant Design components fit the requirement.
2. Use the `antd` MCP server first to inspect the relevant components, APIs, examples, tokens, or semantics.
3. If needed, read the relevant Ant Design AI docs listed above.
4. Check the exact component docs and semantic docs when implementation details matter.
5. Implement with Ant Design first and avoid introducing Tailwind into newly written UI.
6. Keep the result consistent with `FRONTEND_RULES.md`, especially component size, branch discipline, and design continuity.

## Short Instruction For Agents

When writing UI code in this repository:

- Use the `antd` MCP server first
- Read `https://ant.design/llms-full.txt`
- Read `https://ant.design/llms-semantic.md`
- Use `https://ant.design/llms.txt` for discovery
- Read `https://ant.design/components/<component>.md` for the specific component being used
- Read `https://ant.design/components/<component>/semantic.md` when semantic structure matters
- Prefer Ant Design over Mantine, Radix primitives, and custom UI wrappers
- Do not add new Tailwind-based UI
- Move touched UI away from Tailwind when reasonable

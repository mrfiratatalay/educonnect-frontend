# Frontend Rules

This document defines the binding working rules for frontend development.
It must be reviewed before making any frontend change.

## Golden Rules

1. Component size

No component may exceed 300 lines.
If a component approaches this limit, it must be split into smaller components, hooks, or helper files.

2. UI library standard

From this point onward, all component and design work in this project must be based on Ant Design.
For any new UI need, the Ant Design equivalent must be considered first, and Ant Design components should be used directly whenever possible.
Do not introduce new Mantine-based UI, new Radix-based primitives, new Tailwind-based UI, or new custom foundational UI components unless explicitly necessary.

3. Design direction

The frontend component layer and the overall design language will be rewritten gradually around Ant Design.
For core UI decisions such as forms, buttons, inputs, modals, dropdowns, tabs, cards, tables, and navigation, Ant Design is the reference system.
Tailwind is no longer part of the target frontend architecture and should be removed from the codebase over time.
Do not add new Tailwind classes, utilities, configuration, or Tailwind-based styling patterns in new work.
Existing Tailwind usage should be replaced gradually with Ant Design composition and minimal project-level CSS only where Ant Design does not cover the requirement.

4. Refactor discipline

Any screen or component that is touched should be adjusted or migrated toward Ant Design when appropriate.
Instead of increasing multi-library UI mixing inside the same screen, the codebase should be simplified around Ant Design and away from Tailwind, Mantine, and custom primitive layers.
When adding new UI, first evaluate the existing project structure, then Ant Design components, and only after that consider project-level composable abstractions if needed.

## Implementation Note

Before any new frontend work begins, compliance with these rules must be checked first, and only then should code be written.
The Ant Design direction defined in this file is binding and must be treated as the default standard for new UI decisions.

# Project Rules: move-coaching

This `WARP.md` defines project-scoped rules, conventions, and context that Warp agents must follow when working in this repository.

## Core References

- Primary product requirements: `PRD.md`
- System prompt / AI instructions: `PROMPT.md`

Agents should consult these documents for domain context, product decisions, and any cross-cutting constraints before implementing significant changes.

## Git & Branching Conventions

- **Default branch**: `main`
- **Branch naming**:
  - Features: `feat/<short-kebab-summary>`
  - Fixes: `fix/<short-kebab-summary>`
  - Chores/infra: `chore/<short-kebab-summary>`
- **Commits**:
  - Prefer **Conventional Commits** style headers:
    - `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`, `docs: ...`, `test: ...` etc.
  - Use **multi-line commit messages** when helpful:
    - First line: concise summary (max ~72 chars).
    - Blank line.
    - Bullet list of key changes, rationale, and any breaking behavior.
  - Keep commits logically scoped and revert-friendly.

## Confidential Files & Version Control

The following files are considered **confidential project metadata** and **must not be committed**:

- `PRD.md`
- `PROMPT.md`
- `WARP.md`

On each developer machine, ensure these are excluded via Git’s local exclude file (not committed to the repo):

- Edit `.git/info/exclude` and add:
  - `PRD.md`
  - `PROMPT.md`
  - `WARP.md`

Agents must treat these files as **non-public** and avoid copying large sections into answers that could be shared outside the repository.

## File Structure Guidelines

- Keep top-level directories focused and descriptive (e.g., `app/`, `src/`, `config/`, `scripts/`, `tests/`).
- Co-locate domain logic, types, and tests where practical (e.g., feature folders).
- Prefer **feature-oriented** structure over purely technical layering when it improves clarity.
- Avoid deep nesting where a flatter structure would be clearer.
- When adding new files, follow existing patterns in this repo before introducing new ones.

## Naming Conventions

- **TypeScript/JavaScript**:
  - Files: `kebab-case` (e.g., `user-profile.ts`, `coach-dashboard.tsx`).
  - React components: `PascalCase` (e.g., `CoachDashboard`, `SessionCard`).
  - Hooks: `camelCase` starting with `use` (e.g., `useCoachingPlan`).
  - Variables & functions: `camelCase`.
  - Classes & types/interfaces: `PascalCase`.
- **Tests**:
  - Match the implementation filename with a `.test.ts` / `.test.tsx` suffix in the appropriate test directory or next to the file, following existing project style.

## TypeScript Best Practices

- Always prefer **TypeScript** over plain JavaScript for new code.
- Enable and respect strictness settings already configured in the project.
- Prefer **explicit types** for public functions, component props, and return values.
- Avoid `any` unless absolutely necessary and document its use with a comment.
- Use **type-safe APIs** and utilities (e.g., discriminated unions, `enum`/literal types, helper types) instead of ad-hoc `string`/`number` parameters.
- Keep business logic out of React components where feasible; move it into domain services/utilities.

## Shopify & Frontend Best Practices (if applicable)

If integrating with Shopify or similar commerce APIs:

- Use official SDKs and typed clients where available.
- Centralize Shopify API access (e.g., dedicated service modules) rather than sprinkling calls throughout the UI.
- Handle rate limiting, retries, and error mapping in a single, well-typed layer.
- Never expose secrets (API keys, tokens) in frontend bundles.

For UI and components (React/TypeScript assumed):

- Prefer **functional components** with hooks.
- Use existing design system or component library patterns before creating custom components.
- Keep components small and focused; extract subcomponents when JSX becomes large or complex.

## Accessibility Standards

- Follow **WCAG 2.1 AA**-aligned practices where reasonable.
- Always provide accessible names/labels for interactive elements (`aria-label`, `aria-labelledby`, or visible text).
- Ensure interactive elements use semantic HTML (`<button>`, `<a>`, `<input>`, etc.) rather than generic `<div>`s.
- Maintain sufficient color contrast per the design system.
- Ensure components are keyboard navigable (tab order, focus styles, `onKeyDown` handlers where appropriate).
- Associate form controls with labels and error messaging.
- When adding or changing UI, consider screen reader behavior and test with common patterns (e.g., `role`, ARIA attributes) as needed.

## How Agents Should Use These Rules

- Always respect the conventions and constraints in this file when generating or editing code.
- Prefer existing patterns and styles in this codebase over introducing new ones.
- Before large changes, reference `PRD.md` and `PROMPT.md` for product context.
- When conventions here conflict with generic best practices, **this `WARP.md` takes precedence for this project**.

# AGENTS.md

This project was generated from MVPKit Core.

## Mission

Prioritize production-safe edits for template builders. Keep API and type contracts coherent before UI polish.

## Source Of Truth

1. `packages/types`
2. `services/api/src/trpc`
3. `docs/llm/context-map.md`
4. `docs/llm/change-playbooks.md`

## Baseline Modules

- auth: Better Auth powered auth flows with app-level sign in/up components.
- storage: R2-backed upload and list operations exposed via tRPC.
- user-shell: Authenticated app shell and baseline user profile contract.

## Working Rules

- Prefer incremental changes with explicit type safety.
- Do not remove baseline modules without updating router contracts.
- Use `pnpm` scripts for validation.
- Keep generated files and template placeholders intact.

## Runtime Details

- Template version: 0.1.0
- Project domain: hello-world.mvpkit.dev

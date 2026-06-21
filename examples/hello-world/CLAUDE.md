# CLAUDE.md

Claude adapter for MVPKit template projects.

Primary instruction source is `AGENTS.md`. Treat this file as a tool-specific shim.

## Load Order

1. `AGENTS.md`
2. `docs/llm/context-map.md`
3. `docs/llm/change-playbooks.md`

## Task Bias

- Builder-first output.
- Preserve baseline module behavior.
- Keep docs and implementation aligned.

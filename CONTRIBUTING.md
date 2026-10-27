# Contributing

ui-gen is an MIT project maintained by Régis KIKI (chrisregis100).

```bash
pnpm install
pnpm build
pnpm test
```

Node.js 20 or newer is required. Do not commit `.env` files or API keys. `.env.example` is the only env file that belongs in git.

`@ui-gen/cli` and `@ui-gen/mcp` should stay thin. Generation, config, and file writes belong in `@ui-gen/core` so the CLI and MCP server cannot drift.

The unscoped npm name `ui-gen` is taken. Publishable names are `@ui-gen/cli`, `@ui-gen/core`, and `@ui-gen/mcp`. The CLI binary remains `ui-gen`.

# ui-gen

ui-gen generates a React, TypeScript, and Tailwind component from a text prompt and writes it into your project. The source lands in your repository, the same way the shadcn CLI copies components instead of shipping a locked runtime package.

It is a CLI (`ui-gen`) and an MCP server (`ui-gen-mcp`) for coding agents. Both call the same `@ui-gen/core` pipeline.

Maintainer: Régis KIKI (chrisregis100). This tree is the v0.1 source. A public GitHub remote is not attached yet.

## Package name

The unscoped npm name `ui-gen` is already published (an unrelated Astro scaffold). This project uses:

| Package | npm name | Binary |
| --- | --- | --- |
| CLI | `@ui-gen/cli` | `ui-gen` |
| Core | `@ui-gen/core` | |
| MCP | `@ui-gen/mcp` | `ui-gen-mcp` |

## Requirements

- Node.js 20 or newer
- pnpm 10
- A React + TypeScript project that uses Tailwind
- An API key for an OpenAI-compatible chat API

The default provider is xAI:

- Base URL: `https://api.x.ai/v1`
- Model: `grok-4.7`
- Key: `XAI_API_KEY` or `GROK_API_KEY`

`OPENAI_API_KEY` works with `UI_GEN_BASE_URL` (or `OPENAI_BASE_URL`) for any other OpenAI-compatible endpoint. If that is the only key present during `ui-gen init`, the config defaults to `https://api.openai.com/v1` and `gpt-4.1`.

## Install

From this repository:

```bash
pnpm install
pnpm build
```

Run the CLI from the repo:

```bash
pnpm ui-gen init
pnpm ui-gen generate "pricing card with three tiers"
```

Or call the built binary directly:

```bash
node packages/cli/dist/index.js init
node packages/mcp/dist/index.js
```

Link the binaries onto your PATH if you want `ui-gen` and `ui-gen-mcp` globally:

```bash
pnpm --dir packages/cli link --global
pnpm --dir packages/mcp link --global
```

## Configure a key

Copy the example env file in the project you are generating into, or let `ui-gen init` create `.env.example`. Put the real key in `.env` (never commit it):

```bash
XAI_API_KEY=your-key
```

ui-gen reads `.env` from the project directory and does not override variables that are already set. Resolution order for a generate call:

1. `--model` and an explicit base URL, when passed to the API
2. `UI_GEN_MODEL`, `UI_GEN_BASE_URL`, `OPENAI_BASE_URL`
3. `provider` in `ui-gen.json`
4. Built-in default (`grok-4.7` on `https://api.x.ai/v1`)

Key order for an xAI base URL is `XAI_API_KEY`, then `GROK_API_KEY`, then `OPENAI_API_KEY`. For any other base URL, `OPENAI_API_KEY` is first. If no key is set, generate exits with `missing_api_key` and the message tells you which variables to set. No network call is made.

The client posts to `{baseUrl}/chat/completions` and asks for a JSON schema with `name`, `description`, and `code`. If that endpoint rejects `json_schema`, ui-gen retries once with `json_object`.

## CLI

```bash
ui-gen init
ui-gen generate "pricing card with three tiers and a primary CTA"
ui-gen g "accessible search input" --name SearchField
ui-gen list
ui-gen add ./DraftCard.tsx
```

`init` detects Next.js, Vite, or React, including `components.json` and `tsconfig` path aliases when they exist. It writes `ui-gen.json` and prints notes for Tailwind and TypeScript. The default components directory is `src/components/ui`. If the project has no `src/` directory but already has `components/`, init uses `components/ui`.

```bash
ui-gen init --force
ui-gen init --components-dir src/components/ui --rsc true
ui-gen init --json
```

`--yes` is accepted and is a no-op: init does not prompt.

`generate` asks the model for JSON `{ name, description, code }`, checks that the code has a named export, writes `ComponentName.tsx`, and adds a line to `index.ts` in that directory.

```bash
ui-gen generate "icon button" --name IconButton --path src/components/ui --dry-run
ui-gen generate "icon button" --overwrite --json --model grok-4.7
ui-gen g "quiet icon button" --yes --silent
```

| Flag | Effect |
| --- | --- |
| `--name` | Force the PascalCase component name |
| `--path` | Relative `.tsx` file or directory |
| `--overwrite` | Replace an existing file |
| `--dry-run` | Print the component and do not write |
| `--json` | Machine-readable JSON on stdout |
| `--silent` | Print only the import line |
| `--yes` | Do not prompt. An existing file is an error unless `--overwrite` is set |
| `--model` | Override the model for this call |
| `--cwd` | Project directory |

On a terminal, generate asks before replacing a file. `--yes`, `--json`, and non-interactive runs do not ask.

`add` copies a local `.tsx` file that already has a named export into the configured directory and updates `index.ts`. `ui-gen add Button` ensures the barrel export when `button.tsx` is already there.

After a successful generate you get an import you can paste:

```ts
import { PricingCard } from "@/components/ui/pricing-card";
```

That specifier assumes `@/*` maps to `./src/*` (or the alias init recorded from `tsconfig.json`). Add the path if your project does not have it yet:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Generated files are yours. Review them before you commit. ui-gen does not install Tailwind, React, or icon packages. The model may import `lucide-react`, `next/link`, or your `cn` helper only when those already exist in the project.

## MCP

`@ui-gen/mcp` is a stdio server. Tools:

| Tool | What it does |
| --- | --- |
| `init_project` | Same as `ui-gen init` |
| `generate_component` | Same as `ui-gen generate` |
| `add_component` | Same as `ui-gen add` |
| `list_components` | Scan the components directory |
| `get_project_config` | Read `ui-gen.json` |

`generate_component` and `init_project` are marked as writes. `list_components` and `get_project_config` are read-only.

Cursor MCP config, using the built file from a checkout:

```json
{
  "mcpServers": {
    "ui-gen": {
      "command": "node",
      "args": ["/absolute/path/to/ui-gen/packages/mcp/dist/index.js"],
      "env": {
        "XAI_API_KEY": "your-key"
      }
    }
  }
}
```

After `ui-gen-mcp` is on your PATH, and the key is already in the environment Cursor launches:

```json
{
  "mcpServers": {
    "ui-gen": {
      "command": "ui-gen-mcp"
    }
  }
}
```

The server logs to stderr. stdout is the MCP protocol.

## Project layout

```text
apps/web        Next.js landing (src/components/ui)
packages/core   generation, config, and file writes
packages/cli    ui-gen binary
packages/mcp    ui-gen-mcp binary
```

## Landing

`apps/web` is a Next.js App Router site. The page is composed from components in `apps/web/src/components/ui`. `apps/web/ui-gen.json` sets `componentsDir` to that folder.

```bash
pnpm install
pnpm --filter web dev
```

The dev server binds `0.0.0.0` and port `${PORT:-3000}`. Open `http://localhost:3000`.

`pnpm build` compiles the packages and the landing. To build only the site, run `pnpm --filter web build`.

Navbar, Hero, FeatureGrid, HowItWorks, CtaBanner, Footer, and Button in that folder were generated with `ui-gen` against xAI. CodePreview is still local source because that generate call timed out. To regenerate the sections once a model key is available:

```bash
pnpm build
pnpm --filter web gen:ui
```

`gen:ui` runs `ui-gen generate --overwrite` for Navbar, Hero, FeatureGrid, HowItWorks, CodePreview, CtaBanner, and Footer. Put `XAI_API_KEY`, `GROK_API_KEY`, or `OPENAI_API_KEY` in the environment or in `apps/web/.env`. With no key, generate exits `missing_api_key` and does not call the network.

`ui-gen.json` looks like this:

```json
{
  "version": 1,
  "tsx": true,
  "rsc": true,
  "framework": "next",
  "componentsDir": "src/components/ui",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib"
  },
  "tailwind": {
    "css": "src/app/globals.css"
  },
  "provider": {
    "baseUrl": "https://api.x.ai/v1",
    "model": "grok-4.7"
  },
  "paths": {
    "aliasPrefix": "@",
    "aliasBase": "src"
  }
}
```

## Development

```bash
pnpm install
pnpm build
pnpm test
```

`pnpm build` compiles `@ui-gen/core`, `@ui-gen/cli`, `@ui-gen/mcp`, and the landing in `apps/web`. `pnpm test` runs Vitest against the TypeScript source. It does not call a live model. Generate tests inject a fake provider. A missing API key is covered by a unit test.

## License

MIT. Copyright (c) 2026 Régis KIKI.

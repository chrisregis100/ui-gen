import {
  addLocalComponent,
  generateComponent,
  initProject,
  listComponents,
  loadConfig,
  serializeError,
  VERSION,
} from "@ui-gen/core"
import { McpServer } from "@modelcontextprotocol/server"
import * as z from "zod/v4"

export function createUiGenServer(): McpServer {
  const server = new McpServer({
    name: "ui-gen",
    version: VERSION,
  })

  server.registerTool(
    "generate_component",
    {
      title: "Generate component",
      description:
        "Generate a React, TypeScript, and Tailwind component from a prompt and write it into the project. Requires ui-gen.json (call init_project first) and XAI_API_KEY, GROK_API_KEY, or OPENAI_API_KEY.",
      inputSchema: z.object({
        prompt: z.string().min(1).describe("What the component should be"),
        name: z.string().optional().describe("PascalCase component name"),
        path: z.string().optional().describe("Relative .tsx file or directory"),
        cwd: z.string().optional().describe("Project directory. Defaults to the server process cwd."),
        overwrite: z.boolean().optional().describe("Replace an existing component file"),
        dryRun: z.boolean().optional().describe("Return the component without writing it"),
        model: z.string().optional().describe("Model id override"),
      }),
      annotations: {
        title: "Generate component",
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (input) => {
      try {
        const result = await generateComponent({
          prompt: input.prompt,
          ...(input.name ? { name: input.name } : {}),
          ...(input.path ? { path: input.path } : {}),
          ...(input.cwd ? { cwd: input.cwd } : {}),
          ...(input.overwrite ? { overwrite: true } : {}),
          ...(input.dryRun ? { dryRun: true } : {}),
          ...(input.model ? { model: input.model } : {}),
        })
        return {
          content: [{ type: "text" as const, text: `${result.importLine}\n${result.relativePath}` }],
          structuredContent: result,
        }
      } catch (error) {
        return toolError(error)
      }
    },
  )

  server.registerTool(
    "init_project",
    {
      title: "Init project",
      description:
        "Detect the React project and write ui-gen.json plus .env.example notes for the API key, Tailwind, and TypeScript.",
      inputSchema: z.object({
        cwd: z.string().optional().describe("Project directory. Defaults to the server process cwd."),
        force: z.boolean().optional().describe("Overwrite an existing ui-gen.json"),
        componentsDir: z.string().optional().describe("Relative components directory"),
        rsc: z.boolean().optional().describe("Force React Server Components mode"),
      }),
      annotations: {
        title: "Init project",
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        const result = await initProject({
          ...(input.cwd ? { cwd: input.cwd } : {}),
          ...(input.force ? { force: true } : {}),
          ...(input.componentsDir ? { componentsDir: input.componentsDir } : {}),
          ...(input.rsc !== undefined ? { rsc: input.rsc } : {}),
        })
        return {
          content: [
            {
              type: "text" as const,
              text: `Wrote ${result.configPath}. Components go in ${result.config.componentsDir}.`,
            },
          ],
          structuredContent: result,
        }
      } catch (error) {
        return toolError(error)
      }
    },
  )

  server.registerTool(
    "list_components",
    {
      title: "List components",
      description: "List .tsx components in the configured components directory.",
      inputSchema: z.object({
        cwd: z.string().optional().describe("Project directory. Defaults to the server process cwd."),
      }),
      annotations: {
        title: "List components",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        const components = await listComponents(input.cwd)
        return {
          content: [
            {
              type: "text" as const,
              text: components.length === 0 ? "No components yet." : components.map((item) => item.importLine).join("\n"),
            },
          ],
          structuredContent: { components },
        }
      } catch (error) {
        return toolError(error)
      }
    },
  )

  server.registerTool(
    "get_project_config",
    {
      title: "Get project config",
      description: "Read ui-gen.json for the project. Does not modify files.",
      inputSchema: z.object({
        cwd: z.string().optional().describe("Project directory. Defaults to the server process cwd."),
      }),
      annotations: {
        title: "Get project config",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        const loaded = await loadConfig(input.cwd ?? process.cwd())
        return {
          content: [{ type: "text" as const, text: JSON.stringify(loaded.config, null, 2) }],
          structuredContent: loaded,
        }
      } catch (error) {
        return toolError(error)
      }
    },
  )

  server.registerTool(
    "add_component",
    {
      title: "Add local component",
      description:
        "Copy a local .tsx file into the configured components directory and export it from index.ts, or ensure the barrel export for a component that is already there.",
      inputSchema: z.object({
        source: z.string().min(1).describe("Component name or path to a .tsx file"),
        name: z.string().optional().describe("PascalCase export name"),
        cwd: z.string().optional().describe("Project directory. Defaults to the server process cwd."),
        overwrite: z.boolean().optional().describe("Replace an existing component file"),
        dryRun: z.boolean().optional().describe("Report the destination without writing"),
      }),
      annotations: {
        title: "Add local component",
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        const result = await addLocalComponent({
          source: input.source,
          ...(input.name ? { name: input.name } : {}),
          ...(input.cwd ? { cwd: input.cwd } : {}),
          ...(input.overwrite ? { overwrite: true } : {}),
          ...(input.dryRun ? { dryRun: true } : {}),
        })
        return {
          content: [{ type: "text" as const, text: result.importLine }],
          structuredContent: result,
        }
      } catch (error) {
        return toolError(error)
      }
    },
  )

  return server
}

function toolError(error: unknown): {
  isError: true
  content: [{ type: "text"; text: string }]
} {
  const serialized = serializeError(error)
  return {
    isError: true,
    content: [{ type: "text", text: `${serialized.code}: ${serialized.message}` }],
  }
}

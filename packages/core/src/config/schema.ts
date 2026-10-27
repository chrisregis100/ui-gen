import path from "node:path"
import { z } from "zod"

export const VERSION = "0.1.0"
export const CONFIG_FILENAME = "ui-gen.json"
export const DEFAULT_BASE_URL = "https://api.x.ai/v1"
export const DEFAULT_MODEL = "grok-4.7"
export const OPENAI_BASE_URL = "https://api.openai.com/v1"
export const OPENAI_DEFAULT_MODEL = "gpt-4.1"

const relativePath = z
  .string()
  .min(1)
  .refine(
    (value) => !path.isAbsolute(value) && !value.split(/[/\\]/).includes(".."),
    "Path must stay inside the project",
  )

export const uiGenConfigSchema = z
  .object({
    version: z.literal(1).default(1),
    tsx: z.literal(true).default(true),
    rsc: z.boolean().default(false),
    framework: z.enum(["next", "vite", "react", "unknown"]).default("unknown"),
    componentsDir: relativePath.default("src/components/ui"),
    aliases: z
      .object({
        components: z.string().min(1).default("@/components"),
        ui: z.string().min(1).default("@/components/ui"),
        utils: z.string().min(1).default("@/lib/utils"),
        lib: z.string().min(1).default("@/lib"),
      })
      .default({
        components: "@/components",
        ui: "@/components/ui",
        utils: "@/lib/utils",
        lib: "@/lib",
      }),
    tailwind: z
      .object({
        css: relativePath.default("src/app/globals.css"),
        config: relativePath.optional(),
      })
      .default({ css: "src/app/globals.css" }),
    provider: z
      .object({
        baseUrl: z
          .string()
          .refine((value) => {
            try {
              const url = new URL(value)
              return url.protocol === "https:" || url.protocol === "http:"
            } catch {
              return false
            }
          }, "Expected an http(s) URL")
          .default(DEFAULT_BASE_URL),
        model: z.string().min(1).default(DEFAULT_MODEL),
      })
      .default({ baseUrl: DEFAULT_BASE_URL, model: DEFAULT_MODEL }),
    paths: z
      .object({
        aliasPrefix: z.string().min(1).default("@"),
        aliasBase: z.string().default("src"),
      })
      .default({ aliasPrefix: "@", aliasBase: "src" }),
  })
  .strict()

export type UiGenConfig = z.infer<typeof uiGenConfigSchema>

export const TAILWIND_TYPESCRIPT_NOTES = [
  "Components are TypeScript (.tsx) with a named export and an exported props interface.",
  "Style with Tailwind utility classes. ui-gen does not install or configure Tailwind.",
  "Accessible markup is required: labels, button types, alt text, and visible focus.",
  "Files are copied into your project. They are yours to edit, not a locked dependency.",
] as const

export function isXaiBaseUrl(baseUrl: string): boolean {
  try {
    return new URL(baseUrl).hostname === "api.x.ai"
  } catch {
    return baseUrl.includes("api.x.ai")
  }
}

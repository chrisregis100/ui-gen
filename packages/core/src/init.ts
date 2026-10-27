import path from "node:path"
import type { ZodError } from "zod"
import { ensureEnvExample, loadDotEnv } from "./env.js"
import { UiGenError } from "./errors.js"
import { detectProject, type DetectedProject } from "./config/detect.js"
import { findConfigPath, saveConfig } from "./config/load.js"
import {
  CONFIG_FILENAME,
  DEFAULT_BASE_URL,
  DEFAULT_MODEL,
  OPENAI_BASE_URL,
  OPENAI_DEFAULT_MODEL,
  TAILWIND_TYPESCRIPT_NOTES,
  uiGenConfigSchema,
  type UiGenConfig,
} from "./config/schema.js"
import { exists } from "./fs/exists.js"

export interface InitOptions {
  cwd?: string
  force?: boolean
  componentsDir?: string
  rsc?: boolean
  env?: NodeJS.ProcessEnv
}

export interface InitResult {
  created: boolean
  overwritten: boolean
  configPath: string
  config: UiGenConfig
  detected: DetectedProject
  envExampleUpdated: boolean
  notes: string[]
}

export async function initProject(options: InitOptions = {}): Promise<InitResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd())
  const env = options.env ?? process.env
  await loadDotEnv(cwd, env)

  const existing = path.join(cwd, CONFIG_FILENAME)
  const found = await findConfigPath(cwd)
  if (found && !options.force) {
    if (path.dirname(found) === cwd) {
      throw new UiGenError(
        "config_exists",
        `${CONFIG_FILENAME} already exists. Pass --force to overwrite it.`,
      )
    }
    throw new UiGenError(
      "config_exists",
      `Found ${found}. Pass --force to write a separate ${CONFIG_FILENAME} in this directory.`,
    )
  }

  const detected = await detectProject(cwd)
  const config = buildConfig(detected, options, env)
  const overwritten = await exists(existing)
  const configPath = await saveConfig(cwd, config)
  const envExampleUpdated = await ensureEnvExample(cwd)
  const notes: string[] = [...TAILWIND_TYPESCRIPT_NOTES]
  if (!detected.hasTailwind) {
    notes.push(
      "Tailwind was not detected. Generated components still use utility classes; install Tailwind before they render as intended.",
    )
  }
  if (detected.hasComponentsJson) {
    notes.push("Detected components.json and reused its aliases, RSC flag, and Tailwind paths.")
  }
  notes.push("Set XAI_API_KEY or GROK_API_KEY before generating. OPENAI_API_KEY works with UI_GEN_BASE_URL.")

  return {
    created: !overwritten,
    overwritten,
    configPath,
    config,
    detected,
    envExampleUpdated,
    notes,
  }
}

function buildConfig(
  detected: DetectedProject,
  options: InitOptions,
  env: NodeJS.ProcessEnv,
): UiGenConfig {
  const xai = env.XAI_API_KEY?.trim() || env.GROK_API_KEY?.trim()
  const openaiOnly = Boolean(env.OPENAI_API_KEY?.trim()) && !xai
  const baseUrl =
    env.UI_GEN_BASE_URL?.trim() ||
    env.OPENAI_BASE_URL?.trim() ||
    (openaiOnly ? OPENAI_BASE_URL : DEFAULT_BASE_URL)
  const model =
    env.UI_GEN_MODEL?.trim() ||
    (baseUrl.includes("api.x.ai") ? DEFAULT_MODEL : OPENAI_DEFAULT_MODEL)

  const parsed = uiGenConfigSchema.safeParse({
    version: 1,
    tsx: true,
    rsc: options.rsc ?? detected.rsc,
    framework: detected.framework,
    componentsDir: options.componentsDir ?? detected.componentsDir,
    aliases: detected.aliases,
    tailwind: {
      css: detected.tailwindCss,
      ...(detected.tailwindConfig ? { config: detected.tailwindConfig } : {}),
    },
    provider: { baseUrl, model },
    paths: {
      aliasPrefix: detected.aliasPrefix || "@",
      aliasBase: detected.aliasBase,
    },
  })
  if (!parsed.success) {
    throw new UiGenError("invalid_config", formatZodError(parsed.error))
  }
  return parsed.data
}

function formatZodError(error: ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`).join("; ")
}

import path from "node:path"
import { detectProject } from "./config/detect.js"
import { loadConfig } from "./config/load.js"
import { loadDotEnv } from "./env.js"
import { UiGenError } from "./errors.js"
import { normalizeComponentCode, renameComponent } from "./fs/code.js"
import { resolveComponentPaths } from "./fs/paths.js"
import { writeGeneratedComponent, type WriteComponentResult } from "./fs/write-component.js"
import { assertComponentName, toPascalCase } from "./names.js"
import { buildSystemPrompt, buildUserPrompt, type PromptContext } from "./prompts/system.js"
import { resolveProvider } from "./provider/openai-compatible.js"
import type { Provider } from "./provider/types.js"

export interface GenerateSourceOptions {
  cwd?: string
  prompt: string
  name?: string
  path?: string
  model?: string
  baseUrl?: string
  provider?: Provider
  env?: NodeJS.ProcessEnv
}

export interface GeneratedSource {
  name: string
  description: string
  code: string
  model: string
  projectRoot: string
}

export interface GenerateOptions extends GenerateSourceOptions {
  path?: string
  overwrite?: boolean
  dryRun?: boolean
}

export async function generateComponentSource(options: GenerateSourceOptions): Promise<GeneratedSource> {
  const prompt = options.prompt.trim()
  if (!prompt) throw new UiGenError("invalid_prompt", "A prompt is required.")

  const cwd = path.resolve(options.cwd ?? process.cwd())
  const env = options.env ?? process.env
  await loadDotEnv(cwd, env)
  const loaded = await loadConfig(cwd)
  await loadDotEnv(loaded.projectRoot, env)

  const detected = await detectProject(loaded.projectRoot)
  const context: PromptContext = {
    rsc: loaded.config.rsc,
    framework: loaded.config.framework,
    allowLucide: detected.hasLucide,
    ...(detected.hasCn ? { cnModule: loaded.config.aliases.utils } : {}),
  }
  const requestedName = options.name ? assertComponentName(options.name) : undefined
  if (options.path || requestedName) {
    resolveComponentPaths({
      projectRoot: loaded.projectRoot,
      config: loaded.config,
      name: requestedName ?? "PreviewName",
      ...(options.path ? { path: options.path } : {}),
    })
  }
  const model =
    options.model?.trim() || env.UI_GEN_MODEL?.trim() || loaded.config.provider.model
  const baseUrl =
    options.baseUrl?.trim() ||
    env.UI_GEN_BASE_URL?.trim() ||
    env.OPENAI_BASE_URL?.trim() ||
    loaded.config.provider.baseUrl
  const provider =
    options.provider ??
    resolveProvider({
      baseUrl,
      model,
      env,
    })

  const generated = await provider.generateComponent({
    system: buildSystemPrompt(context),
    user: buildUserPrompt({ prompt, ...(requestedName ? { name: requestedName } : {}) }),
    model,
  })

  let name = requestedName ?? safePascal(generated.name)
  let code = generated.code
  if (requestedName && generated.name !== requestedName) {
    const from = safePascal(generated.name)
    code = renameComponent(code, from, requestedName)
    name = requestedName
  } else if (!requestedName) {
    name = safePascal(generated.name)
  }

  return {
    name,
    description: generated.description.trim() || `Generated ${name}.`,
    code: normalizeComponentCode(code, name),
    model,
    projectRoot: loaded.projectRoot,
  }
}

export async function generateComponent(options: GenerateOptions): Promise<WriteComponentResult> {
  const source = await generateComponentSource(options)
  return writeGeneratedComponent({
    cwd: source.projectRoot,
    name: source.name,
    description: source.description,
    code: source.code,
    model: source.model,
    ...(options.path ? { path: options.path } : {}),
    ...(options.overwrite ? { overwrite: true } : {}),
    ...(options.dryRun ? { dryRun: true } : {}),
  })
}

function safePascal(name: string): string {
  try {
    return toPascalCase(name)
  } catch (error) {
    if (error instanceof UiGenError) {
      throw new UiGenError("invalid_response", `The model returned an unusable component name "${name}".`)
    }
    throw error
  }
}

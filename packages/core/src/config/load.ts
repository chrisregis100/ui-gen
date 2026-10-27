import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { CONFIG_FILENAME, uiGenConfigSchema, type UiGenConfig } from "./schema.js"
import { exists } from "../fs/exists.js"
import { UiGenError } from "../errors.js"

export interface LoadedConfig {
  config: UiGenConfig
  configPath: string
  projectRoot: string
}

export async function findConfigPath(start: string): Promise<string | undefined> {
  let dir = path.resolve(start)
  const root = path.parse(dir).root

  while (true) {
    const candidate = path.join(dir, CONFIG_FILENAME)
    if (await exists(candidate)) return candidate
    if ((await exists(path.join(dir, ".git"))) || dir === root) return undefined
    const parent = path.dirname(dir)
    if (parent === dir) return undefined
    dir = parent
  }
}

export async function loadConfig(cwd: string): Promise<LoadedConfig> {
  const configPath = await findConfigPath(cwd)
  if (!configPath) {
    throw new UiGenError(
      "config_not_found",
      "No ui-gen.json found. Run `ui-gen init` in your project first.",
    )
  }

  let raw: unknown
  try {
    raw = JSON.parse(await readFile(configPath, "utf8"))
  } catch (error) {
    throw new UiGenError(
      "invalid_config",
      `Could not parse ${configPath}. ui-gen.json must be JSON without comments.`,
      { cause: error },
    )
  }

  const parsed = uiGenConfigSchema.safeParse(raw)
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ")
    throw new UiGenError("invalid_config", `Invalid ${configPath}. ${details}`)
  }

  return {
    config: parsed.data,
    configPath,
    projectRoot: path.dirname(configPath),
  }
}

export async function saveConfig(projectRoot: string, config: UiGenConfig): Promise<string> {
  const parsed = uiGenConfigSchema.parse(config)
  const configPath = path.join(projectRoot, CONFIG_FILENAME)
  await writeFile(configPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8")
  return configPath
}

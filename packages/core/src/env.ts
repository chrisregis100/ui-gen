import { readFile } from "node:fs/promises"
import path from "node:path"
import { exists } from "./fs/exists.js"

const ENV_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/

export async function loadDotEnv(cwd: string, env: NodeJS.ProcessEnv = process.env): Promise<void> {
  const file = path.join(cwd, ".env")
  if (!(await exists(file))) return

  const text = await readFile(file, "utf8")
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (line.length === 0 || line.startsWith("#")) continue
    const separator = line.indexOf("=")
    if (separator <= 0) continue
    const key = line.slice(0, separator).trim()
    if (!ENV_KEY.test(key) || env[key] !== undefined) continue
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
}

export const ENV_EXAMPLE_BLOCK = `# Added by ui-gen. Default provider is xAI: https://api.x.ai/v1
XAI_API_KEY=
# GROK_API_KEY=
# OPENAI_API_KEY=
# UI_GEN_BASE_URL=
# UI_GEN_MODEL=grok-4.7
`

export async function ensureEnvExample(cwd: string): Promise<boolean> {
  const file = path.join(cwd, ".env.example")
  if (!(await exists(file))) {
    const { writeFile } = await import("node:fs/promises")
    await writeFile(file, ENV_EXAMPLE_BLOCK, "utf8")
    return true
  }

  const { readFile: read, appendFile } = await import("node:fs/promises")
  const current = await read(file, "utf8")
  if (current.includes("XAI_API_KEY") || current.includes("GROK_API_KEY")) return false
  const prefix = current.endsWith("\n") || current.length === 0 ? "" : "\n"
  await appendFile(file, `${prefix}\n${ENV_EXAMPLE_BLOCK}`, "utf8")
  return true
}

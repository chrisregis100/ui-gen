import {
  UiGenError,
  generateComponentSource,
  isUiGenError,
  writeGeneratedComponent,
  type WriteComponentResult,
} from "@ui-gen/core"
import { printWriteResult } from "../output.js"
import { canPrompt, confirmOverwrite } from "../prompt.js"

export interface GenerateFlags {
  name?: string
  path?: string
  yes?: boolean
  overwrite?: boolean
  dryRun?: boolean
  json?: boolean
  silent?: boolean
  model?: string
  cwd?: string
}

export async function runGenerate(prompt: string, flags: GenerateFlags): Promise<WriteComponentResult> {
  const source = await generateComponentSource({
    prompt,
    ...(flags.cwd ? { cwd: flags.cwd } : {}),
    ...(flags.name ? { name: flags.name } : {}),
    ...(flags.path ? { path: flags.path } : {}),
    ...(flags.model ? { model: flags.model } : {}),
  })

  const write = (overwrite: boolean) =>
    writeGeneratedComponent({
      cwd: source.projectRoot,
      name: source.name,
      description: source.description,
      code: source.code,
      model: source.model,
      ...(flags.path ? { path: flags.path } : {}),
      ...(overwrite ? { overwrite: true } : {}),
      ...(flags.dryRun ? { dryRun: true } : {}),
    })

  try {
    return await write(Boolean(flags.overwrite))
  } catch (error) {
    if (!isUiGenError(error) || error.code !== "file_exists" || !canPrompt(flags)) throw error
    const relativePath = error.message.split(" already exists")[0] ?? "The component file"
    const confirmed = await confirmOverwrite(relativePath)
    if (!confirmed) {
      throw new UiGenError("file_exists", error.message)
    }
    return write(true)
  }
}

export async function generateCommand(promptParts: string[], flags: GenerateFlags): Promise<void> {
  const prompt = promptParts.join(" ").trim()
  if (!prompt) throw new UiGenError("invalid_prompt", "A prompt is required.")
  const result = await runGenerate(prompt, flags)
  printWriteResult(result, flags)
}

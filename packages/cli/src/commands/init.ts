import {
  UiGenError,
  initProject,
  type InitResult,
} from "@ui-gen/core"
import pc from "picocolors"
import { printJson } from "../output.js"

export interface InitFlags {
  cwd?: string
  yes?: boolean
  force?: boolean
  json?: boolean
  componentsDir?: string
  rsc?: string
}

export async function runInit(flags: InitFlags): Promise<InitResult> {
  return initProject({
    ...(flags.cwd ? { cwd: flags.cwd } : {}),
    ...(flags.force ? { force: true } : {}),
    ...(flags.componentsDir ? { componentsDir: flags.componentsDir } : {}),
    ...rscOption(flags.rsc),
  })
}

export async function initCommand(flags: InitFlags): Promise<void> {
  const result = await runInit(flags)
  if (flags.json) {
    printJson({ ok: true, ...result })
    return
  }

  const verb = result.overwritten ? "Overwrote" : "Created"
  process.stdout.write(`${pc.bold(`${verb} ui-gen.json`)}\n`)
  process.stdout.write(`Components directory: ${result.config.componentsDir}\n`)
  process.stdout.write(`Provider: ${result.config.provider.baseUrl} (${result.config.provider.model})\n`)
  if (result.envExampleUpdated) {
    process.stdout.write("Updated .env.example with XAI_API_KEY.\n")
  }
  process.stdout.write("\n")
  for (const note of result.notes) {
    process.stdout.write(`${pc.dim("•")} ${note}\n`)
  }
}

function rscOption(value: string | undefined): { rsc?: boolean } {
  if (value === undefined || value === "auto") return {}
  if (value === "true") return { rsc: true }
  if (value === "false") return { rsc: false }
  throw new UiGenError("invalid_flag", '--rsc must be "auto", "true", or "false".')
}

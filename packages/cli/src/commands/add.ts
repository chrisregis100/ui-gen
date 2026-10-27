import { addLocalComponent, type WriteComponentResult } from "@ui-gen/core"
import { printWriteResult } from "../output.js"

export interface AddFlags {
  name?: string
  overwrite?: boolean
  dryRun?: boolean
  json?: boolean
  silent?: boolean
  cwd?: string
}

export async function runAdd(source: string, flags: AddFlags): Promise<WriteComponentResult> {
  return addLocalComponent({
    source,
    ...(flags.cwd ? { cwd: flags.cwd } : {}),
    ...(flags.name ? { name: flags.name } : {}),
    ...(flags.overwrite ? { overwrite: true } : {}),
    ...(flags.dryRun ? { dryRun: true } : {}),
  })
}

export async function addCommand(source: string, flags: AddFlags): Promise<void> {
  const result = await runAdd(source, flags)
  printWriteResult(
    {
      ...result,
      description: result.description,
    },
    flags,
  )
}

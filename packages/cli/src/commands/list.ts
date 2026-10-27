import { listComponents } from "@ui-gen/core"
import pc from "picocolors"
import { printJson } from "../output.js"

export interface ListFlags {
  cwd?: string
  json?: boolean
}

export async function listCommand(flags: ListFlags): Promise<void> {
  const components = await listComponents(flags.cwd)
  if (flags.json) {
    printJson({ ok: true, components })
    return
  }
  if (components.length === 0) {
    process.stdout.write("No components yet. Generate one with `ui-gen generate`.\n")
    return
  }
  for (const component of components) {
    process.stdout.write(`${pc.bold(component.name)}  ${pc.dim(component.path)}\n`)
    process.stdout.write(`  ${component.importLine}\n`)
  }
}

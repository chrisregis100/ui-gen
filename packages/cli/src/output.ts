import pc from "picocolors"
import { serializeError, type WriteComponentResult } from "@ui-gen/core"

export function wantsJson(argv: string[] = process.argv): boolean {
  return argv.includes("--json")
}

export function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
}

export function printError(error: unknown, json: boolean): void {
  const payload = serializeError(error)
  if (json) {
    printJson({ ok: false, error: payload })
    return
  }
  process.stderr.write(`${pc.red(`ui-gen: ${payload.message}`)}\n`)
}

export function printWriteResult(
  result: WriteComponentResult,
  flags: { json?: boolean; silent?: boolean },
): void {
  if (flags.json) {
    printJson({ ok: true, ...result })
    return
  }
  if (flags.silent) {
    process.stdout.write(`${result.importLine}\n`)
    return
  }

  const verb = result.model === "local" ? "Added" : "Generated"
  const title = result.dryRun ? `Dry run for ${result.name}` : `${verb} ${result.name}`
  const fileLine = result.dryRun
    ? `${result.relativePath}${result.existed ? " (would replace the existing file)" : ""}`
    : `${result.overwritten ? "Replaced" : "Wrote"} ${result.relativePath}`
  process.stdout.write(`${pc.bold(title)}\n`)
  process.stdout.write(`${fileLine}\n`)
  process.stdout.write(
    `${result.dryRun ? "Would update" : "Updated"} ${result.barrelPath}\n\n`,
  )
  process.stdout.write(`${pc.cyan(result.importLine)}\n`)
  if (result.dryRun) {
    process.stdout.write(`\n${result.code}`)
  }
}

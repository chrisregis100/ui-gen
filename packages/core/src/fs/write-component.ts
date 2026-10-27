import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import type { UiGenConfig } from "../config/schema.js"
import { loadConfig } from "../config/load.js"
import { UiGenError, isNodeError } from "../errors.js"
import { barrelFileName, upsertBarrelExport } from "./barrel.js"
import { normalizeComponentCode } from "./code.js"
import { exists } from "./exists.js"
import { resolveComponentPaths, toPosixRelative } from "./paths.js"

export interface WriteGeneratedComponentInput {
  cwd?: string
  name: string
  description?: string
  code: string
  model: string
  path?: string
  overwrite?: boolean
  dryRun?: boolean
}

export interface WriteComponentResult {
  name: string
  description: string
  code: string
  relativePath: string
  barrelPath: string
  importLine: string
  dryRun: boolean
  existed: boolean
  overwritten: boolean
  model: string
}

export async function writeGeneratedComponent(
  input: WriteGeneratedComponentInput,
): Promise<WriteComponentResult> {
  const cwd = input.cwd ?? process.cwd()
  const loaded = await loadConfig(cwd)
  const paths = resolveComponentPaths({
    projectRoot: loaded.projectRoot,
    config: loaded.config,
    name: input.name,
    ...(input.path ? { path: input.path } : {}),
  })
  const code = normalizeComponentCode(input.code, paths.name)
  const fileExists = await exists(paths.absolutePath)
  const dryRun = input.dryRun ?? false

  if (fileExists && !input.overwrite && !dryRun) {
    throw new UiGenError(
      "file_exists",
      `${paths.relativePath} already exists. Pass --overwrite to replace it.`,
    )
  }

  if (!dryRun) {
    await mkdir(paths.directory, { recursive: true })
    try {
      await writeFile(paths.absolutePath, code, { encoding: "utf8", flag: input.overwrite ? "w" : "wx" })
    } catch (error) {
      if (isNodeError(error) && error.code === "EEXIST") {
        throw new UiGenError(
          "file_exists",
          `${paths.relativePath} already exists. Pass --overwrite to replace it.`,
        )
      }
      throw error
    }
  }

  const barrel = await writeBarrel({
    directory: paths.directory,
    projectRoot: loaded.projectRoot,
    exportName: paths.name,
    fileBase: paths.fileBase,
    dryRun,
  })

  return {
    name: paths.name,
    description: input.description?.trim() || `Generated ${paths.name}.`,
    code,
    relativePath: paths.relativePath,
    barrelPath: barrel.relativePath,
    importLine: paths.importLine,
    dryRun,
    existed: fileExists,
    overwritten: fileExists && !dryRun,
    model: input.model,
  }
}

export async function ensureBarrelForExistingFile(input: {
  projectRoot: string
  config: UiGenConfig
  absolutePath: string
  name: string
  dryRun?: boolean
}): Promise<{ barrelPath: string; importLine: string }> {
  const paths = resolveComponentPaths({
    projectRoot: input.projectRoot,
    config: input.config,
    name: input.name,
    path: toPosixRelative(input.projectRoot, input.absolutePath),
  })
  const barrel = await writeBarrel({
    directory: paths.directory,
    projectRoot: input.projectRoot,
    exportName: paths.name,
    fileBase: paths.fileBase,
    dryRun: input.dryRun ?? false,
  })
  return { barrelPath: barrel.relativePath, importLine: paths.importLine }
}

async function writeBarrel(input: {
  directory: string
  projectRoot: string
  exportName: string
  fileBase: string
  dryRun: boolean
}): Promise<{ relativePath: string }> {
  const indexTs = path.join(input.directory, "index.ts")
  const indexTsx = path.join(input.directory, "index.tsx")
  const barrelPath = barrelFileName(
    input.directory,
    await exists(indexTsx),
    await exists(indexTs),
  )
  const current = (await exists(barrelPath)) ? await readFile(barrelPath, "utf8") : ""
  let next: string
  try {
    next = upsertBarrelExport(current, input.exportName, input.fileBase)
  } catch (error) {
    throw new UiGenError(
      "barrel_conflict",
      error instanceof Error ? error.message : "Could not update index.ts.",
    )
  }
  if (!input.dryRun && next !== current) {
    await mkdir(input.directory, { recursive: true })
    await writeFile(barrelPath, next, "utf8")
  }
  return { relativePath: toPosixRelative(input.projectRoot, barrelPath) }
}

import { readFile } from "node:fs/promises"
import path from "node:path"
import { loadConfig } from "./config/load.js"
import { UiGenError } from "./errors.js"
import { readExportedComponentName } from "./fs/code.js"
import { exists } from "./fs/exists.js"
import { toPosixRelative } from "./fs/paths.js"
import {
  ensureBarrelForExistingFile,
  writeGeneratedComponent,
  type WriteComponentResult,
} from "./fs/write-component.js"
import { assertComponentName, toKebabCase, toPascalCase } from "./names.js"

export interface AddOptions {
  cwd?: string
  source: string
  name?: string
  overwrite?: boolean
  dryRun?: boolean
}

export async function addLocalComponent(options: AddOptions): Promise<WriteComponentResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd())
  const loaded = await loadConfig(cwd)
  const source = options.source.trim()
  if (!source) throw new UiGenError("invalid_source", "A component path or name is required.")

  if (!looksLikePath(source)) {
    return addByName(loaded.projectRoot, loaded.config.componentsDir, source, options)
  }

  const absoluteSource = path.resolve(cwd, source)
  if (!(await exists(absoluteSource))) {
    throw new UiGenError("not_found", `Could not read ${source}.`)
  }
  const code = await readFile(absoluteSource, "utf8")
  const exported = readExportedComponentName(code)
  const name = options.name
    ? assertComponentName(options.name)
    : exported
      ? assertComponentName(exported)
      : undefined
  if (!name) {
    throw new UiGenError("invalid_component", "Could not find a named export. Pass --name.")
  }

  const destination = path.join(loaded.projectRoot, loaded.config.componentsDir, `${toKebabCase(name)}.tsx`)
  if (path.resolve(absoluteSource) === path.resolve(destination)) {
    const barrel = await ensureBarrelForExistingFile({
      projectRoot: loaded.projectRoot,
      config: loaded.config,
      absolutePath: destination,
      name,
      ...(options.dryRun ? { dryRun: true } : {}),
    })
    return {
      name,
      description: `Existing ${name}.`,
      code,
      relativePath: toPosixRelative(loaded.projectRoot, destination),
      barrelPath: barrel.barrelPath,
      importLine: barrel.importLine,
      dryRun: options.dryRun ?? false,
      existed: true,
      overwritten: false,
      model: "local",
    }
  }

  return writeGeneratedComponent({
    cwd: loaded.projectRoot,
    name,
    description: `Added ${name} from ${source}.`,
    code,
    model: "local",
    ...(options.overwrite ? { overwrite: true } : {}),
    ...(options.dryRun ? { dryRun: true } : {}),
  })
}

async function addByName(
  projectRoot: string,
  componentsDir: string,
  source: string,
  options: AddOptions,
): Promise<WriteComponentResult> {
  const name = assertComponentName(options.name ?? source)
  const relativePath = `${componentsDir.replace(/\\/g, "/").replace(/\/$/, "")}/${toKebabCase(name)}.tsx`
  const absolute = path.join(projectRoot, relativePath)
  if (!(await exists(absolute))) {
    let alias = source
    try {
      alias = toKebabCase(toPascalCase(source))
    } catch {
      alias = source
    }
    throw new UiGenError(
      "not_found",
      `No ${alias}.tsx in ${componentsDir}. Pass a .tsx path, or run ui-gen generate.`,
    )
  }

  const loaded = await loadConfig(projectRoot)
  const code = await readFile(absolute, "utf8")
  const barrel = await ensureBarrelForExistingFile({
    projectRoot,
    config: loaded.config,
    absolutePath: absolute,
    name,
    ...(options.dryRun ? { dryRun: true } : {}),
  })
  return {
    name,
    description: `Existing ${name}.`,
    code,
    relativePath,
    barrelPath: barrel.barrelPath,
    importLine: barrel.importLine,
    dryRun: options.dryRun ?? false,
    existed: true,
    overwritten: false,
    model: "local",
  }
}

function looksLikePath(source: string): boolean {
  return source.includes("/") || source.includes("\\") || source.endsWith(".tsx")
}

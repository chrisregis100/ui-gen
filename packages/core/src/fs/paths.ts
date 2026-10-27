import path from "node:path"
import { UiGenError } from "../errors.js"
import type { UiGenConfig } from "../config/schema.js"
import { assertComponentName, toKebabCase } from "../names.js"

export function toPosixRelative(from: string, to: string): string {
  return path.relative(from, to).split(path.sep).join("/")
}

export function assertSafeRelative(relativePath: string): void {
  const normalized = path.posix.normalize(relativePath.replace(/\\/g, "/"))
  if (
    path.isAbsolute(relativePath) ||
    normalized === ".." ||
    normalized.startsWith("../") ||
    normalized.split("/").includes("..")
  ) {
    throw new UiGenError("path_escape", "Paths must stay inside the project directory.")
  }
}

export function assertInside(root: string, target: string): void {
  const relative = path.relative(path.resolve(root), path.resolve(target))
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new UiGenError("path_escape", "Refusing to write outside the project directory.")
  }
}

export interface ComponentPaths {
  name: string
  absolutePath: string
  relativePath: string
  directory: string
  fileBase: string
  importLine: string
}

export function resolveComponentPaths(input: {
  projectRoot: string
  config: UiGenConfig
  name: string
  path?: string
}): ComponentPaths {
  const name = assertComponentName(input.name)
  const relativePath = outputRelativePath(input.config, name, input.path)
  assertSafeRelative(relativePath)
  const absolutePath = path.resolve(input.projectRoot, relativePath)
  assertInside(input.projectRoot, absolutePath)
  const fileBase = path.basename(relativePath, ".tsx")
  if (fileBase === "index") {
    throw new UiGenError(
      "invalid_path",
      "Refusing to write a component as index.tsx. Choose a component file name.",
    )
  }

  return {
    name,
    absolutePath,
    relativePath,
    directory: path.dirname(absolutePath),
    fileBase,
    importLine: buildImportLine(input.config, input.projectRoot, absolutePath, name),
  }
}

function outputRelativePath(config: UiGenConfig, name: string, requested?: string): string {
  if (!requested) {
    return `${config.componentsDir.replace(/\\/g, "/").replace(/\/$/, "")}/${toKebabCase(name)}.tsx`
  }
  const normalized = requested.replace(/\\/g, "/").replace(/^\.\//, "")
  if (normalized.endsWith(".tsx")) return normalized
  return `${normalized.replace(/\/$/, "")}/${toKebabCase(name)}.tsx`
}

export function buildImportLine(
  config: UiGenConfig,
  projectRoot: string,
  absoluteFile: string,
  name: string,
): string {
  const relative = toPosixRelative(projectRoot, absoluteFile).replace(/\.tsx$/, "")
  const base = config.paths.aliasBase.replace(/^\.\//, "").replace(/\/$/, "")
  const prefix = config.paths.aliasPrefix.replace(/\/$/, "")
  let specifier = `./${relative}`
  if (!base) {
    specifier = `${prefix}/${relative}`
  } else if (relative === base || relative.startsWith(`${base}/`)) {
    const rest = relative.slice(base.length).replace(/^\//, "")
    specifier = rest ? `${prefix}/${rest}` : prefix
  }
  return `import { ${name} } from "${specifier}";`
}

import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { loadConfig } from "../config/load.js"
import { readExportedComponentName } from "./code.js"
import { exists } from "./exists.js"
import { buildImportLine } from "./paths.js"
import { toPascalCase } from "../names.js"

export interface ListedComponent {
  name: string
  path: string
  importLine: string
}

export async function listComponents(cwd = process.cwd()): Promise<ListedComponent[]> {
  const loaded = await loadConfig(cwd)
  const directory = path.join(loaded.projectRoot, loaded.config.componentsDir)
  if (!(await exists(directory))) return []

  const entries = await readdir(directory, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx") && entry.name !== "index.tsx")
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))

  const components: ListedComponent[] = []
  for (const fileName of files) {
    const absolute = path.join(directory, fileName)
    const source = await readFile(absolute, "utf8")
    const exported = readExportedComponentName(source)
    const fallback = fileName.replace(/\.tsx$/, "")
    let name = exported
    if (!name) {
      try {
        name = toPascalCase(fallback)
      } catch {
        continue
      }
    }
    const relativePath = path.posix.join(loaded.config.componentsDir.replace(/\\/g, "/"), fileName)
    components.push({
      name,
      path: relativePath,
      importLine: buildImportLine(loaded.config, loaded.projectRoot, absolute, name),
    })
  }
  return components
}

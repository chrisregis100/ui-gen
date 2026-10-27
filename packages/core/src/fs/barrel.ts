import path from "node:path"

export function upsertBarrelExport(source: string, exportName: string, fileBase: string): string {
  const newline = source.includes("\r\n") ? "\r\n" : "\n"
  const quote = detectQuote(source)
  const semicolon = usesSemicolons(source) ? ";" : ""
  const specifier = `./${fileBase}`
  const line = `export { ${exportName} } from ${quote}${specifier}${quote}${semicolon}`
  const withoutThisFile = removeExportsFrom(source, specifier)
  const existing = findExport(withoutThisFile, exportName)

  if (existing) {
    throw new Error(
      `index.ts already exports ${exportName} from "${existing.specifier}". Remove that export before adding ${specifier}.`,
    )
  }

  const trimmed = withoutThisFile.replace(/\s*$/, "")
  const next = trimmed.length === 0 ? line : `${trimmed}${newline}${line}`
  return `${next}${newline}`
}

function removeExportsFrom(source: string, specifier: string): string {
  const newline = source.includes("\r\n") ? "\r\n" : "\n"
  return source
    .split(/\r?\n/)
    .filter((line) => {
      const match = line.match(/export\s*\{[^}]*\}\s*from\s*(['"])([^'"]+)\1/)
      if (!match?.[2]) return true
      return match[2].replace(/\.tsx$/, "") !== specifier
    })
    .join(newline)
}

export function barrelFileName(directory: string, indexTsxExists: boolean, indexTsExists: boolean): string {
  if (!indexTsExists && indexTsxExists) return path.join(directory, "index.tsx")
  return path.join(directory, "index.ts")
}

function findExport(source: string, exportName: string): { specifier: string } | undefined {
  const pattern = new RegExp(
    `export\\s*\\{([^}]*\\b${escapeRegExp(exportName)}\\b[^}]*)\\}\\s*from\\s*(['"])([^'"]+)\\2`,
    "g",
  )
  const match = pattern.exec(source)
  if (!match?.[3]) return undefined
  return { specifier: match[3] }
}

function detectQuote(source: string): '"' | "'" {
  const match = source.match(/from\s+(['"])/)
  return match?.[1] === "'" ? "'" : '"'
}

function usesSemicolons(source: string): boolean {
  const exportLines = source.split(/\r?\n/).filter((line) => line.trim().startsWith("export "))
  if (exportLines.length === 0) return true
  return exportLines.every((line) => line.trim().endsWith(";"))
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

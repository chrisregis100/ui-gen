import { UiGenError } from "../errors.js"

const MAX_CODE_LENGTH = 200_000

export function exportPattern(name: string): RegExp {
  return new RegExp(`export\\s+(?:async\\s+)?(?:function|const|class)\\s+${name}\\b`)
}

export function normalizeComponentCode(code: string, name: string): string {
  if (code.includes("\0")) {
    throw new UiGenError("invalid_code", "Generated component is not a text file.")
  }

  let source = code.replace(/^\uFEFF/, "").trim()
  const wrapped = source.match(/^```(?:tsx|typescript|ts|jsx)?\s*\n([\s\S]*?)\n```$/)
  if (wrapped?.[1]) source = wrapped[1].trim()
  if (source.includes("```")) {
    throw new UiGenError("invalid_code", "Generated code still contains markdown fences.")
  }
  if (source.length > MAX_CODE_LENGTH) {
    throw new UiGenError("invalid_code", "Generated component is unexpectedly large.")
  }
  if (!exportPattern(name).test(source)) {
    throw new UiGenError("invalid_code", `Generated code has no named export for ${name}.`)
  }
  return `${source}\n`
}

export function renameComponent(code: string, from: string, to: string): string {
  if (from === to) return code
  return code.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "g"), to)
}

export function readExportedComponentName(code: string): string | undefined {
  const fn = code.match(/export\s+(?:async\s+)?function\s+([A-Z][A-Za-z0-9]*)\b/)
  if (fn?.[1]) return fn[1]
  const constant = code.match(/export\s+const\s+([A-Z][A-Za-z0-9]*)\s*[=:]/)
  return constant?.[1]
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

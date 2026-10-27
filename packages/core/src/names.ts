import { UiGenError } from "./errors.js"

const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/

export function toPascalCase(input: string): string {
  const trimmed = input.trim()
  if (PASCAL_CASE.test(trimmed)) return trimmed

  const spaced = trimmed
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
  const parts = spaced.split(/[^A-Za-z0-9]+/).filter((part) => part.length > 0)
  if (parts.length === 0) {
    throw new UiGenError("invalid_name", `Cannot derive a component name from "${input}".`)
  }

  const pascal = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")
  if (!PASCAL_CASE.test(pascal)) {
    throw new UiGenError("invalid_name", `"${input}" is not a valid component name.`)
  }
  return pascal
}

export function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
}

export function assertComponentName(name: string): string {
  const pascal = toPascalCase(name)
  if (pascal === "Index") {
    throw new UiGenError(
      "invalid_name",
      'Component name "Index" clashes with index.ts. Choose another name.',
    )
  }
  return pascal
}

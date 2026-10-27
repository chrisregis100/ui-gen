export function stripJsonComments(source: string): string {
  let result = ""
  let inString = false
  let quote = ""
  let escaped = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index] ?? ""
    const next = source[index + 1] ?? ""

    if (inString) {
      result += char
      if (escaped) {
        escaped = false
        continue
      }
      if (char === "\\") {
        escaped = true
        continue
      }
      if (char === quote) inString = false
      continue
    }

    if (char === '"' || char === "'") {
      inString = true
      quote = char
      result += char
      continue
    }

    if (char === "/" && next === "/") {
      while (index < source.length && source[index] !== "\n") index += 1
      result += "\n"
      continue
    }

    if (char === "/" && next === "*") {
      index += 2
      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        index += 1
      }
      index += 1
      continue
    }

    result += char
  }

  return result.replace(/,\s*([}\]])/g, "$1")
}

export function parseJsonc(source: string): unknown {
  return JSON.parse(stripJsonComments(source))
}

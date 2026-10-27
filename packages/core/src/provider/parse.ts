import { z } from "zod"
import { UiGenError } from "../errors.js"

const modelOutputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
  code: z.string().min(1),
})

export const COMPONENT_JSON_SCHEMA = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "PascalCase React component name",
    },
    description: {
      type: "string",
      description: "One sentence describing the component",
    },
    code: {
      type: "string",
      description: "Complete .tsx file source with no markdown fences",
    },
  },
  required: ["name", "description", "code"],
  additionalProperties: false,
} as const

export function parseModelJson(raw: string): unknown {
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new UiGenError("invalid_response", "The model returned an empty response.")
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (fenced?.[1]) {
      try {
        return JSON.parse(fenced[1])
      } catch {
        // Fall through to the brace slice below.
      }
    }
    const start = trimmed.indexOf("{")
    const end = trimmed.lastIndexOf("}")
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1))
      } catch {
        // Reported below.
      }
    }
    throw new UiGenError(
      "invalid_response",
      "The model did not return JSON with name, description, and code.",
    )
  }
}

export function parseGeneratedComponent(raw: string): {
  name: string
  description: string
  code: string
} {
  const parsed = modelOutputSchema.safeParse(parseModelJson(raw))
  if (!parsed.success) {
    throw new UiGenError(
      "invalid_response",
      "The model JSON did not include a component name and code.",
    )
  }
  return parsed.data
}

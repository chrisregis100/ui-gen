import { describe, expect, it } from "vitest"
import { parseJsonc } from "../src/jsonc.js"

describe("parseJsonc", () => {
  it("keeps urls inside strings and drops comments plus trailing commas", () => {
    const parsed = parseJsonc(`{
      // path alias
      "compilerOptions": {
        "paths": {
          "@/*": ["./src/*"],
        },
        "docs": "https://api.x.ai/v1",
      },
    }`) as { compilerOptions: { docs: string; paths: Record<string, string[]> } }

    expect(parsed.compilerOptions.docs).toBe("https://api.x.ai/v1")
    expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./src/*"])
  })
})

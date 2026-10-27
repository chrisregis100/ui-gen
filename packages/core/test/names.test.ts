import { describe, expect, it } from "vitest"
import { toKebabCase, toPascalCase } from "../src/names.js"

describe("component names", () => {
  it("preserves PascalCase and kebab-cases acronyms", () => {
    expect(toPascalCase("PricingCard")).toBe("PricingCard")
    expect(toPascalCase("pricing card")).toBe("PricingCard")
    expect(toPascalCase("pricing-card")).toBe("PricingCard")
    expect(toPascalCase("UIButton")).toBe("UIButton")
    expect(toKebabCase("PricingCard")).toBe("pricing-card")
    expect(toKebabCase("UIButton")).toBe("ui-button")
    expect(toKebabCase("HTMLParser")).toBe("html-parser")
  })

  it("rejects names that are not identifiers", () => {
    expect(() => toPascalCase("!!!")).toThrow(/component name/)
  })
})

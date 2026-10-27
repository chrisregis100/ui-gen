import { describe, expect, it } from "vitest"
import { upsertBarrelExport } from "../src/fs/barrel.js"

describe("barrel exports", () => {
  it("creates and appends named exports without duplicating them", () => {
    const created = upsertBarrelExport("", "PricingCard", "pricing-card")
    expect(created).toBe('export { PricingCard } from "./pricing-card";\n')

    const again = upsertBarrelExport(created, "PricingCard", "pricing-card")
    expect(again).toBe(created)

    const withButton = upsertBarrelExport(created, "IconButton", "icon-button")
    expect(withButton).toBe(
      'export { PricingCard } from "./pricing-card";\nexport { IconButton } from "./icon-button";\n',
    )
  })

  it("matches an existing quote and semicolon style", () => {
    const source = "export { Button } from './button'\n"
    const next = upsertBarrelExport(source, "Card", "card")
    expect(next).toBe("export { Button } from './button'\nexport { Card } from './card'\n")
  })

  it("replaces an older export from the same file when the component is renamed", () => {
    const source = 'export { PricingCard } from "./pricing-card";\nexport { Button } from "./button";\n'
    const next = upsertBarrelExport(source, "IconButton", "pricing-card")
    expect(next).toBe(
      'export { Button } from "./button";\nexport { IconButton } from "./pricing-card";\n',
    )
  })

  it("refuses to export the same name from two files", () => {
    const source = 'export { PricingCard } from "./price";\n'
    expect(() => upsertBarrelExport(source, "PricingCard", "pricing-card")).toThrow(/already exports/)
  })
})

import { describe, expect, it } from "vitest"
import { createOpenAICompatibleProvider } from "../src/provider/openai-compatible.js"
import { parseGeneratedComponent, parseModelJson } from "../src/provider/parse.js"

const component = {
  name: "PricingCard",
  description: "Three pricing tiers.",
  code: "export function PricingCard() { return <article />; }\n",
}

describe("structured model output", () => {
  it("parses a JSON object", () => {
    expect(parseGeneratedComponent(JSON.stringify(component)).name).toBe("PricingCard")
  })

  it("recovers JSON wrapped in a fence", () => {
    const raw = "```json\n" + JSON.stringify(component) + "\n```"
    expect(parseModelJson(raw)).toMatchObject({ name: "PricingCard" })
  })

  it("rejects a payload without code", () => {
    expect(() => parseGeneratedComponent('{"name":"PricingCard"}')).toThrow(/name and code/)
  })

  it("reads structured JSON from an injected OpenAI-compatible client", async () => {
    const provider = createOpenAICompatibleProvider({
      apiKey: "test",
      baseUrl: "https://api.x.ai/v1",
      model: "grok-4.7",
      complete: async (request) => {
        expect(request.responseFormat).toBe("json_schema")
        expect(request.messages[0]?.content).toContain("Tailwind")
        return JSON.stringify(component)
      },
    })

    const generated = await provider.generateComponent({
      system: "Use Tailwind.",
      user: "pricing card",
    })
    expect(generated.code).toContain("PricingCard")
  })
})

import { describe, expect, it } from "vitest"
import { DEFAULT_BASE_URL, DEFAULT_MODEL } from "../src/config/schema.js"
import { resolveCredentials } from "../src/provider/credentials.js"

describe("resolveCredentials", () => {
  it("explains how to set a key when none is present", () => {
    expect(() => resolveCredentials({ env: {} })).toThrow(/XAI_API_KEY or GROK_API_KEY/)
  })

  it("prefers the xAI key and grok model", () => {
    const resolved = resolveCredentials({
      env: { XAI_API_KEY: "xai-key", OPENAI_API_KEY: "openai-key" },
    })
    expect(resolved).toMatchObject({
      apiKey: "xai-key",
      baseUrl: DEFAULT_BASE_URL,
      model: DEFAULT_MODEL,
      source: "xai",
    })
  })

  it("accepts GROK_API_KEY as the xAI key", () => {
    const resolved = resolveCredentials({ env: { GROK_API_KEY: "grok-key" } })
    expect(resolved.source).toBe("grok")
    expect(resolved.baseUrl).toBe(DEFAULT_BASE_URL)
  })

  it("uses OpenAI when that is the only key", () => {
    const resolved = resolveCredentials({ env: { OPENAI_API_KEY: "openai-key" } })
    expect(resolved.baseUrl).toBe("https://api.openai.com/v1")
    expect(resolved.model).toBe("gpt-4.1")
    expect(resolved.source).toBe("openai")
  })

  it("lets UI_GEN_BASE_URL and UI_GEN_MODEL override defaults", () => {
    const resolved = resolveCredentials({
      env: {
        OPENAI_API_KEY: "openai-key",
        UI_GEN_BASE_URL: "https://example.test/v1/",
        UI_GEN_MODEL: "custom-model",
      },
    })
    expect(resolved.baseUrl).toBe("https://example.test/v1")
    expect(resolved.model).toBe("custom-model")
  })
})

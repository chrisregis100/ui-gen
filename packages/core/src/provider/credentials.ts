import {
  DEFAULT_BASE_URL,
  DEFAULT_MODEL,
  OPENAI_BASE_URL,
  OPENAI_DEFAULT_MODEL,
  isXaiBaseUrl,
} from "../config/schema.js"
import { UiGenError } from "../errors.js"

export interface CredentialInput {
  apiKey?: string
  baseUrl?: string
  model?: string
  env?: NodeJS.ProcessEnv
}

export interface ResolvedCredentials {
  apiKey: string
  baseUrl: string
  model: string
  source: "explicit" | "xai" | "grok" | "openai"
}

export function resolveCredentials(input: CredentialInput = {}): ResolvedCredentials {
  const env = input.env ?? process.env
  const explicitKey = clean(input.apiKey)
  const xaiKey = clean(env.XAI_API_KEY)
  const grokKey = clean(env.GROK_API_KEY)
  const openaiKey = clean(env.OPENAI_API_KEY)
  const envBase = clean(env.UI_GEN_BASE_URL) || clean(env.OPENAI_BASE_URL)

  let baseUrl = stripSlash(clean(input.baseUrl) || envBase || "")
  if (!baseUrl) {
    baseUrl = xaiKey || grokKey || !openaiKey ? DEFAULT_BASE_URL : OPENAI_BASE_URL
  }

  const xaiEndpoint = isXaiBaseUrl(baseUrl)
  const apiKey = explicitKey || (xaiEndpoint ? xaiKey || grokKey || openaiKey : openaiKey || xaiKey || grokKey)
  if (!apiKey) {
    throw new UiGenError(
      "missing_api_key",
      "No API key found. Set XAI_API_KEY or GROK_API_KEY for https://api.x.ai/v1, or OPENAI_API_KEY with UI_GEN_BASE_URL for another OpenAI-compatible endpoint.",
    )
  }

  let source: ResolvedCredentials["source"]
  if (explicitKey) source = "explicit"
  else if (apiKey === xaiKey) source = "xai"
  else if (apiKey === grokKey) source = "grok"
  else source = "openai"

  const model =
    clean(input.model) ||
    clean(env.UI_GEN_MODEL) ||
    (xaiEndpoint ? DEFAULT_MODEL : OPENAI_DEFAULT_MODEL)

  return { apiKey, baseUrl, model, source }
}

function clean(value: string | undefined): string {
  return value?.trim() ?? ""
}

function stripSlash(value: string): string {
  return value.replace(/\/+$/, "")
}

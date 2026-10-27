import { UiGenError } from "../errors.js"
import { resolveCredentials, type CredentialInput } from "./credentials.js"
import { COMPONENT_JSON_SCHEMA, parseGeneratedComponent } from "./parse.js"
import type { Provider } from "./types.js"

export interface CompletionRequest {
  apiKey: string
  baseUrl: string
  model: string
  messages: Array<{ role: "system" | "user"; content: string }>
  responseFormat: "json_schema" | "json_object"
}

export type CompleteFn = (request: CompletionRequest) => Promise<string>

export interface OpenAICompatibleOptions {
  apiKey: string
  baseUrl: string
  model: string
  complete?: CompleteFn
}

class ProviderHttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ProviderHttpError"
    this.status = status
  }
}

export function createOpenAICompatibleProvider(options: OpenAICompatibleOptions): Provider {
  const complete = options.complete ?? defaultComplete

  return {
    id: "openai-compatible",
    model: options.model,
    async generateComponent(request) {
      const model = request.model?.trim() || options.model
      const messages = [
        { role: "system" as const, content: request.system },
        { role: "user" as const, content: request.user },
      ]
      const run = (responseFormat: CompletionRequest["responseFormat"]) =>
        complete({
          apiKey: options.apiKey,
          baseUrl: options.baseUrl,
          model,
          messages,
          responseFormat,
        })

      try {
        return parseGeneratedComponent(await run("json_schema"))
      } catch (error) {
        if (!shouldRetryWithJsonObject(error)) throw wrapProviderError(error, options.baseUrl)
      }

      try {
        return parseGeneratedComponent(await run("json_object"))
      } catch (error) {
        throw wrapProviderError(error, options.baseUrl)
      }
    },
  }
}

export function resolveProvider(input: CredentialInput = {}): Provider {
  return createOpenAICompatibleProvider(resolveCredentials(input))
}

async function defaultComplete(request: CompletionRequest): Promise<string> {
  const url = `${request.baseUrl}/chat/completions`
  let response: Response
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${request.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        response_format:
          request.responseFormat === "json_schema"
            ? {
                type: "json_schema",
                json_schema: {
                  name: "ui_component",
                  strict: true,
                  schema: COMPONENT_JSON_SCHEMA,
                },
              }
            : { type: "json_object" },
      }),
      signal: AbortSignal.timeout(180_000),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error"
    throw new UiGenError("provider_unreachable", `Could not reach ${request.baseUrl}. ${redact(message, request.apiKey)}`, {
      cause: error,
    })
  }

  const bodyText = await response.text()
  const body = parseJson(bodyText)
  if (!response.ok) {
    const message = readErrorMessage(body) || bodyText.slice(0, 500) || response.statusText
    throw new ProviderHttpError(response.status, redact(message, request.apiKey))
  }

  const content = readContent(body)
  if (!content.trim()) {
    throw new UiGenError("empty_response", "The model returned an empty response.")
  }
  return content
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function readErrorMessage(body: unknown): string {
  if (!body || typeof body !== "object") return ""
  if ("error" in body && body.error && typeof body.error === "object" && "message" in body.error) {
    const message = body.error.message
    return typeof message === "string" ? message : ""
  }
  if ("message" in body && typeof body.message === "string") return body.message
  return ""
}

function readContent(body: unknown): string {
  if (!body || typeof body !== "object" || !("choices" in body) || !Array.isArray(body.choices)) return ""
  const choice = body.choices[0]
  if (!choice || typeof choice !== "object" || !("message" in choice)) return ""
  const message = choice.message
  if (!message || typeof message !== "object" || !("content" in message)) return ""
  return readMessageContent(message.content)
}

function readMessageContent(content: unknown): string {
  if (typeof content === "string") return content
  if (!Array.isArray(content)) return ""
  return content
    .map((part) => {
      if (typeof part === "string") return part
      if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
        return part.text
      }
      return ""
    })
    .join("")
}

function shouldRetryWithJsonObject(error: unknown): boolean {
  if (!(error instanceof ProviderHttpError)) return false
  if (error.status !== 400 && error.status !== 422) return false
  const message = error.message.toLowerCase()
  return (
    message.includes("response_format") ||
    message.includes("json_schema") ||
    message.includes("structured")
  )
}

function wrapProviderError(error: unknown, baseUrl: string): UiGenError {
  if (error instanceof UiGenError) return error
  if (error instanceof ProviderHttpError && error.status === 401) {
    return new UiGenError(
      "unauthorized",
      "The API key was rejected. Check XAI_API_KEY, GROK_API_KEY, or OPENAI_API_KEY.",
      { cause: error },
    )
  }
  if (error instanceof ProviderHttpError) {
    return new UiGenError("provider_error", `Model request failed (${error.status}): ${error.message}`, {
      cause: error,
    })
  }
  if (error instanceof Error) {
    return new UiGenError("provider_unreachable", `Could not reach ${baseUrl}. ${error.message}`, {
      cause: error,
    })
  }
  return new UiGenError("provider_error", "The model request failed.")
}

function redact(message: string, secret: string): string {
  if (!secret) return message
  return message.split(secret).join("[redacted]")
}

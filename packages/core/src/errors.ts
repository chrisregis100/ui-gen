export class UiGenError extends Error {
  readonly code: string

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = "UiGenError"
    this.code = code
  }
}

export function isUiGenError(error: unknown): error is UiGenError {
  return error instanceof UiGenError
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error
}

export interface SerializedError {
  code: string
  message: string
}

export function serializeError(error: unknown): SerializedError {
  if (error instanceof UiGenError) {
    return { code: error.code, message: error.message }
  }
  if (error instanceof Error) {
    return { code: "error", message: error.message }
  }
  return { code: "error", message: String(error) }
}

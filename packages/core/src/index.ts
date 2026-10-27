export { VERSION, CONFIG_FILENAME, DEFAULT_BASE_URL, DEFAULT_MODEL, TAILWIND_TYPESCRIPT_NOTES } from "./config/schema.js"
export { uiGenConfigSchema, isXaiBaseUrl, type UiGenConfig } from "./config/schema.js"
export { loadConfig, saveConfig, findConfigPath, type LoadedConfig } from "./config/load.js"
export { detectProject, type DetectedProject } from "./config/detect.js"
export { initProject, type InitOptions, type InitResult } from "./init.js"
export {
  generateComponent,
  generateComponentSource,
  type GenerateOptions,
  type GenerateSourceOptions,
  type GeneratedSource,
} from "./generate.js"
export { addLocalComponent, type AddOptions } from "./add.js"
export { listComponents, type ListedComponent } from "./fs/list.js"
export {
  writeGeneratedComponent,
  type WriteComponentResult,
  type WriteGeneratedComponentInput,
} from "./fs/write-component.js"
export { UiGenError, isUiGenError, serializeError, type SerializedError } from "./errors.js"
export { resolveCredentials, type CredentialInput, type ResolvedCredentials } from "./provider/credentials.js"
export {
  createOpenAICompatibleProvider,
  resolveProvider,
  type CompleteFn,
  type CompletionRequest,
} from "./provider/openai-compatible.js"
export type { Provider, GeneratedComponent } from "./provider/types.js"
export { toPascalCase, toKebabCase, assertComponentName } from "./names.js"
export { parseModelJson, parseGeneratedComponent, COMPONENT_JSON_SCHEMA } from "./provider/parse.js"
export { buildSystemPrompt, buildUserPrompt, allowedImports, type PromptContext } from "./prompts/system.js"

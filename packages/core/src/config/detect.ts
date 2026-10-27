import { readFile } from "node:fs/promises"
import path from "node:path"
import { exists } from "../fs/exists.js"
import { parseJsonc } from "../jsonc.js"
import type { UiGenConfig } from "./schema.js"

export interface DetectedProject {
  framework: UiGenConfig["framework"]
  hasSrc: boolean
  rsc: boolean
  componentsDir: string
  tailwindCss: string
  tailwindConfig?: string
  aliases: UiGenConfig["aliases"]
  aliasPrefix: string
  aliasBase: string
  hasLucide: boolean
  hasCn: boolean
  hasTailwind: boolean
  hasComponentsJson: boolean
}

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface TsConfigJson {
  extends?: string
  compilerOptions?: {
    baseUrl?: string
    paths?: Record<string, string[]>
  }
}

interface ComponentsJson {
  rsc?: boolean
  tailwind?: { css?: string; config?: string }
  aliases?: Partial<UiGenConfig["aliases"]>
}

const CSS_CANDIDATES = [
  "src/app/globals.css",
  "app/globals.css",
  "src/styles/globals.css",
  "styles/globals.css",
  "src/index.css",
  "app/index.css",
]

const TAILWIND_CONFIGS = ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"]

export async function detectProject(cwd: string): Promise<DetectedProject> {
  const root = path.resolve(cwd)
  const packageJson = await readPackageJson(root)
  const deps = {
    ...packageJson?.devDependencies,
    ...packageJson?.dependencies,
  }
  const hasSrc = await exists(path.join(root, "src"))
  const framework = detectFramework(deps)
  const hasAppDir =
    (await exists(path.join(root, "src/app"))) || (await exists(path.join(root, "app")))
  const detectedAlias = await readAlias(root)
  const componentsJson = await readComponentsJson(root)
  const aliases: UiGenConfig["aliases"] = {
    components: componentsJson?.aliases?.components ?? "@/components",
    ui: componentsJson?.aliases?.ui ?? "@/components/ui",
    utils: componentsJson?.aliases?.utils ?? "@/lib/utils",
    lib: componentsJson?.aliases?.lib ?? "@/lib",
  }
  const componentsDir = await resolveComponentsDir({
    root,
    hasSrc,
    aliases,
    detectedAlias,
    hasComponentsJson: componentsJson !== undefined,
  })
  const alias = detectedAlias ?? {
    aliasPrefix: "@",
    aliasBase: componentsDir === "src" || componentsDir.startsWith("src/") ? "src" : "",
  }

  const declaredCss = componentsJson?.tailwind?.css
  const tailwindCss = declaredCss && isRelativePath(declaredCss)
    ? declaredCss
    : ((await firstExisting(root, CSS_CANDIDATES)) ?? defaultCss(framework, hasSrc))
  const declaredTwConfig = componentsJson?.tailwind?.config
  const tailwindConfig =
    declaredTwConfig && isRelativePath(declaredTwConfig)
      ? declaredTwConfig
      : await firstExisting(root, TAILWIND_CONFIGS)

  const utilsFile = await findUtilsFile(root, alias.aliasBase)
  const utilsSource = utilsFile ? await readFile(utilsFile, "utf8") : ""
  const hasCn = /\b(?:function|const)\s+cn\b/.test(utilsSource)

  return {
    framework,
    hasSrc,
    rsc: typeof componentsJson?.rsc === "boolean" ? componentsJson.rsc : framework === "next" && hasAppDir,
    componentsDir,
    tailwindCss,
    ...(tailwindConfig ? { tailwindConfig } : {}),
    aliases,
    aliasPrefix: alias.aliasPrefix,
    aliasBase: alias.aliasBase,
    hasLucide: Boolean(deps?.["lucide-react"]),
    hasCn,
    hasTailwind: Boolean(deps?.tailwindcss || deps?.["@tailwindcss/vite"] || deps?.["@tailwindcss/postcss"]),
    hasComponentsJson: componentsJson !== undefined,
  }
}

async function resolveComponentsDir(input: {
  root: string
  hasSrc: boolean
  aliases: UiGenConfig["aliases"]
  detectedAlias: { aliasPrefix: string; aliasBase: string } | undefined
  hasComponentsJson: boolean
}): Promise<string> {
  if (input.hasComponentsJson && input.detectedAlias) {
    const mapped = aliasToDirectory(
      input.aliases.ui,
      input.detectedAlias.aliasPrefix,
      input.detectedAlias.aliasBase,
    )
    if (mapped) return mapped
  }
  if (input.hasSrc || !(await exists(path.join(input.root, "components")))) {
    return "src/components/ui"
  }
  return "components/ui"
}

function detectFramework(deps: Record<string, string> | undefined): UiGenConfig["framework"] {
  if (deps?.next) return "next"
  if (deps?.vite) return "vite"
  if (deps?.react) return "react"
  return "unknown"
}

function defaultCss(framework: UiGenConfig["framework"], hasSrc: boolean): string {
  if (framework === "vite") return hasSrc ? "src/index.css" : "index.css"
  if (framework === "next") return hasSrc ? "src/app/globals.css" : "app/globals.css"
  return hasSrc ? "src/app/globals.css" : "src/app/globals.css"
}

async function readPackageJson(root: string): Promise<PackageJson | undefined> {
  const file = path.join(root, "package.json")
  if (!(await exists(file))) return undefined
  try {
    return JSON.parse(await readFile(file, "utf8")) as PackageJson
  } catch {
    return undefined
  }
}

async function readComponentsJson(root: string): Promise<ComponentsJson | undefined> {
  const file = path.join(root, "components.json")
  if (!(await exists(file))) return undefined
  try {
    return JSON.parse(await readFile(file, "utf8")) as ComponentsJson
  } catch {
    return undefined
  }
}

async function readAlias(root: string): Promise<{ aliasPrefix: string; aliasBase: string } | undefined> {
  const primary = await readTsConfigFile(path.join(root, "tsconfig.json"))
  const fromPrimary = primary ? aliasFromTsConfig(primary.config) : undefined
  if (fromPrimary) return fromPrimary
  const app = await readTsConfigFile(path.join(root, "tsconfig.app.json"))
  return app ? aliasFromTsConfig(app.config) : undefined
}

async function readTsConfigFile(file: string): Promise<{ file: string; config: TsConfigJson } | undefined> {
  if (!(await exists(file))) return undefined
  try {
    const config = parseJsonc(await readFile(file, "utf8")) as TsConfigJson
    if (config.extends?.startsWith(".")) {
      const parentFile = path.resolve(path.dirname(file), config.extends)
      const parent = await readTsConfigFile(parentFile.endsWith(".json") ? parentFile : `${parentFile}.json`)
      if (parent) {
        return {
          file,
          config: {
            compilerOptions: {
              baseUrl: config.compilerOptions?.baseUrl ?? parent.config.compilerOptions?.baseUrl,
              paths: config.compilerOptions?.paths ?? parent.config.compilerOptions?.paths,
            },
          },
        }
      }
    }
    return { file, config }
  } catch {
    return undefined
  }
}

function aliasFromTsConfig(config: TsConfigJson): { aliasPrefix: string; aliasBase: string } | undefined {
  const paths = config.compilerOptions?.paths
  if (!paths) return undefined
  const baseUrl = config.compilerOptions?.baseUrl ?? "."
  const matches = Object.entries(paths)
    .map(([key, targets]) => {
      const target = targets[0]
      const aliasPrefix = normalizePrefix(key)
      if (!aliasPrefix || !target?.includes("*")) return undefined
      return {
        aliasPrefix,
        aliasBase: normalizeTarget(target, baseUrl),
      }
    })
    .filter((match): match is { aliasPrefix: string; aliasBase: string } => match !== undefined)
    .sort((left, right) => left.aliasPrefix.length - right.aliasPrefix.length)

  return matches[0]
}

function normalizePrefix(key: string): string | undefined {
  if (!key.includes("*")) return undefined
  return key.replace(/\/\*$/, "").replace(/\*$/, "")
}

function normalizeTarget(target: string, baseUrl: string): string {
  let value = target.replace(/\\/g, "/").replace(/\/\*$/, "").replace(/\*$/, "").replace(/^\.\//, "")
  let base = baseUrl.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/$/, "")
  if (base === ".") base = ""
  if (base) value = value ? `${base}/${value}` : base
  return value.replace(/\/$/, "")
}

function aliasToDirectory(alias: string, prefix: string, base: string): string | undefined {
  const normalizedPrefix = prefix.replace(/\/$/, "")
  if (alias !== normalizedPrefix && !alias.startsWith(`${normalizedPrefix}/`)) return undefined
  const rest = alias.slice(normalizedPrefix.length).replace(/^\//, "")
  if (!isRelativePath(rest) && rest.includes("..")) return undefined
  const directory = base ? (rest ? `${base}/${rest}` : base) : rest
  return directory && isRelativePath(directory) ? directory : undefined
}

function isRelativePath(value: string): boolean {
  return value.length > 0 && !path.isAbsolute(value) && !value.split(/[/\\]/).includes("..")
}

async function firstExisting(root: string, candidates: string[]): Promise<string | undefined> {
  for (const candidate of candidates) {
    if (await exists(path.join(root, candidate))) return candidate
  }
  return undefined
}

async function findUtilsFile(root: string, aliasBase: string): Promise<string | undefined> {
  const prefixes = aliasBase ? [aliasBase, "src", ""] : ["src", ""]
  for (const prefix of prefixes) {
    for (const fileName of ["lib/utils.ts", "lib/utils.tsx"]) {
      const relative = prefix ? `${prefix}/${fileName}` : fileName
      const absolute = path.join(root, relative)
      if (await exists(absolute)) return absolute
    }
  }
  return undefined
}

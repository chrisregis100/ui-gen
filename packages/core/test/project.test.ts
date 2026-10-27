import { mkdir, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { addLocalComponent } from "../src/add.js"
import { initProject } from "../src/init.js"
import { generateComponent } from "../src/generate.js"
import { listComponents } from "../src/fs/list.js"
import { UiGenError } from "../src/errors.js"
import type { Provider } from "../src/provider/types.js"

const directories: string[] = []

async function tempProject(): Promise<string> {
  const { mkdtemp } = await import("node:fs/promises")
  const dir = await mkdtemp(path.join(tmpdir(), "ui-gen-"))
  directories.push(dir)
  return dir
}

afterEach(async () => {
  const { rm } = await import("node:fs/promises")
  await Promise.all(directories.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

function provider(name = "PricingCard"): Provider {
  return {
    id: "fake",
    model: "grok-4.7",
    async generateComponent(request) {
      expect(request.system).toContain("Accessible markup")
      expect(request.system).toContain('Do not add "use client"')
      const componentName = request.user.includes("exact component name:") ? "IconButton" : name
      return {
        name: componentName,
        description: "A generated component.",
        code: [
          `export interface ${componentName}Props { title: string }`,
          `export function ${componentName}({ title }: ${componentName}Props) {`,
          "  return (",
          '    <article aria-labelledby="title">',
          '      <h2 id="title">{title}</h2>',
          "    </article>",
          "  )",
          "}",
          "",
        ].join("\n"),
      }
    },
  }
}

describe("project integration", () => {
  it("writes ui-gen.json for an empty project and notes Tailwind and TypeScript", async () => {
    const cwd = await tempProject()
    const result = await initProject({ cwd, env: {} })
    expect(result.config.componentsDir).toBe("src/components/ui")
    expect(result.config.provider.model).toBe("grok-4.7")
    expect(result.config.paths).toEqual({ aliasPrefix: "@", aliasBase: "src" })
    expect(result.notes.join(" ")).toMatch(/TypeScript/)
    expect(result.notes.join(" ")).toMatch(/Tailwind/)
    const envExample = await readFile(path.join(cwd, ".env.example"), "utf8")
    expect(envExample).toContain("XAI_API_KEY=")
    const saved = JSON.parse(await readFile(path.join(cwd, "ui-gen.json"), "utf8"))
    expect(saved.componentsDir).toBe("src/components/ui")
  })

  it("detects a Next.js app and a tsconfig alias", async () => {
    const cwd = await tempProject()
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ dependencies: { next: "15.0.0", react: "19.0.0", tailwindcss: "4.0.0" } }),
    )
    await mkdir(path.join(cwd, "src/app"), { recursive: true })
    await writeFile(path.join(cwd, "src/app/globals.css"), "@import 'tailwindcss';\n")
    await writeFile(
      path.join(cwd, "tsconfig.json"),
      `{
        // comment
        "compilerOptions": {
          "baseUrl": ".",
          "paths": { "@/*": ["./src/*"] },
        },
      }`,
    )

    const result = await initProject({ cwd, env: {} })
    expect(result.config.framework).toBe("next")
    expect(result.config.rsc).toBe(true)
    expect(result.config.componentsDir).toBe("src/components/ui")
    expect(result.config.tailwind.css).toBe("src/app/globals.css")
    expect(result.config.paths.aliasBase).toBe("src")
  })

  it("uses components/ui for a project that has no src directory", async () => {
    const cwd = await tempProject()
    await mkdir(path.join(cwd, "components"), { recursive: true })
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ devDependencies: { vite: "6.0.0", react: "19.0.0" } }),
    )
    const result = await initProject({ cwd, env: {} })
    expect(result.config.framework).toBe("vite")
    expect(result.config.rsc).toBe(false)
    expect(result.config.componentsDir).toBe("components/ui")
    expect(result.config.paths.aliasBase).toBe("")
  })

  it("lets components.json override the Next.js RSC default", async () => {
    const cwd = await tempProject()
    await mkdir(path.join(cwd, "src/app"), { recursive: true })
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ dependencies: { next: "15.0.0", react: "19.0.0" } }),
    )
    await writeFile(
      path.join(cwd, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } } }),
    )
    await writeFile(
      path.join(cwd, "components.json"),
      JSON.stringify({
        rsc: false,
        tailwind: { css: "src/app/globals.css" },
        aliases: {
          ui: "@/components/ui",
          components: "@/components",
          utils: "@/lib/utils",
          lib: "@/lib",
        },
      }),
    )
    const result = await initProject({ cwd, env: {} })
    expect(result.config.rsc).toBe(false)
    expect(result.config.componentsDir).toBe("src/components/ui")
    expect(result.notes.join(" ")).toMatch(/components.json/)
  })

  it("requires an API key when no provider is injected", async () => {
    const cwd = await tempProject()
    await initProject({ cwd, env: {} })
    await expect(
      generateComponent({ cwd, prompt: "a button", env: {} }),
    ).rejects.toMatchObject({ code: "missing_api_key" })
  })

  it("writes the component and the barrel export", async () => {
    const cwd = await tempProject()
    await initProject({ cwd, env: {} })
    const result = await generateComponent({
      cwd,
      prompt: "pricing card with three tiers",
      provider: provider(),
      env: {},
    })

    expect(result.relativePath).toBe("src/components/ui/pricing-card.tsx")
    expect(result.importLine).toBe('import { PricingCard } from "@/components/ui/pricing-card";')
    expect(result.dryRun).toBe(false)
    const source = await readFile(path.join(cwd, result.relativePath), "utf8")
    expect(source).toContain("export function PricingCard")
    const barrel = await readFile(path.join(cwd, "src/components/ui/index.ts"), "utf8")
    expect(barrel).toBe('export { PricingCard } from "./pricing-card";\n')
    expect(await listComponents(cwd)).toEqual([
      {
        name: "PricingCard",
        path: "src/components/ui/pricing-card.tsx",
        importLine: result.importLine,
      },
    ])
  })

  it("does not write files on a dry run and refuses to overwrite without the flag", async () => {
    const cwd = await tempProject()
    await initProject({ cwd, env: {} })
    const fake = provider()
    const dry = await generateComponent({
      cwd,
      prompt: "pricing card",
      provider: fake,
      dryRun: true,
      env: {},
    })
    expect(dry.dryRun).toBe(true)
    await expect(readFile(path.join(cwd, dry.relativePath), "utf8")).rejects.toThrow()

    await generateComponent({ cwd, prompt: "pricing card", provider: fake, env: {} })
    await expect(
      generateComponent({ cwd, prompt: "pricing card", provider: fake, env: {} }),
    ).rejects.toBeInstanceOf(UiGenError)

    const replaced = await generateComponent({
      cwd,
      prompt: "pricing card",
      name: "IconButton",
      provider: fake,
      overwrite: true,
      path: "src/components/ui/pricing-card.tsx",
      env: {},
    })
    expect(replaced.overwritten).toBe(true)
    expect(replaced.name).toBe("IconButton")
    const source = await readFile(path.join(cwd, replaced.relativePath), "utf8")
    expect(source).toContain("export function IconButton")
  })

  it("refuses to write outside the project before calling the model", async () => {
    const cwd = await tempProject()
    await initProject({ cwd, env: {} })
    let calls = 0
    const fake: Provider = {
      id: "fake",
      model: "grok-4.7",
      async generateComponent() {
        calls += 1
        return { name: "Button", description: "A button.", code: "export function Button() { return <button type=\"button\">Go</button> }\n" }
      },
    }
    await expect(
      generateComponent({
        cwd,
        prompt: "a button",
        provider: fake,
        path: "../Button.tsx",
        env: {},
      }),
    ).rejects.toMatchObject({ code: "path_escape" })
    expect(calls).toBe(0)
  })

  it("copies a local component into the configured directory", async () => {
    const cwd = await tempProject()
    await initProject({ cwd, env: {} })
    const sourcePath = path.join(cwd, "DraftCard.tsx")
    await writeFile(
      sourcePath,
      "export interface DraftCardProps { title: string }\nexport function DraftCard({ title }: DraftCardProps) {\n  return <article>{title}</article>\n}\n",
    )
    const added = await addLocalComponent({ cwd, source: sourcePath })
    expect(added.relativePath).toBe("src/components/ui/draft-card.tsx")
    expect(added.importLine).toContain("DraftCard")
    const barrel = await readFile(path.join(cwd, "src/components/ui/index.ts"), "utf8")
    expect(barrel).toContain('export { DraftCard } from "./draft-card";')
  })
})

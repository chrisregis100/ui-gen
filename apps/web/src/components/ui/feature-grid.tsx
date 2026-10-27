import { Braces, FileCode2, FolderInput, KeyRound, PencilLine, Waypoints } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Feature {
  title: string
  body: string
  icon: LucideIcon
}

const features: Feature[] = [
  {
    title: "One file, named export",
    body: "A TypeScript function component, a props interface, and Tailwind classes. No default export and no CSS module.",
    icon: FileCode2,
  },
  {
    title: "Copied into the project",
    body: "generate writes ComponentName.tsx and adds a line to index.ts. ui-gen add copies a local file that already has a named export.",
    icon: FolderInput,
  },
  {
    title: "CLI and MCP, one pipeline",
    body: "The ui-gen binary and the ui-gen-mcp server both call @ui-gen/core, so an agent and a terminal write the same kind of file.",
    icon: Waypoints,
  },
  {
    title: "Your paths",
    body: "init reads a Next.js, Vite, or React app, including components.json and tsconfig aliases. The printed import uses that alias.",
    icon: Braces,
  },
  {
    title: "OpenAI-compatible",
    body: "The default provider is xAI: grok-4.7 at https://api.x.ai/v1. OPENAI_API_KEY works with UI_GEN_BASE_URL for another endpoint.",
    icon: KeyRound,
  },
  {
    title: "Yours to edit",
    body: "Review the file before you commit. ui-gen does not install Tailwind, React, or icon packages for you.",
    icon: PencilLine,
  },
]

export interface FeatureGridProps {
  className?: string
}

export function FeatureGrid({ className }: FeatureGridProps) {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className={cn("scroll-mt-20 border-t border-border", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-muted-foreground">Features</p>
          <h2
            id="features-title"
            className="mt-3 font-display text-4xl tracking-tight text-balance sm:text-5xl"
          >
            Written like a component you would keep.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The generator does not ship a component library. It writes source into the directory
            your project already uses.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <li key={feature.title}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
                  <Icon aria-hidden="true" className="size-5 text-accent" />
                  <h3 className="mt-4 text-base font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.body}</p>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

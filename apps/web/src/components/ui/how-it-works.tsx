import { cn } from "@/lib/utils"

export interface HowItWorksProps {
  id?: string
  className?: string
}

const steps: { index: string; title: string; body: string; code: string }[] = [
  {
    index: "01",
    title: "Init the project",
    body: "ui-gen init detects Next.js, Vite, or React, reads components.json and tsconfig aliases, and writes ui-gen.json.",
    code: "pnpm dlx ui-gen init",
  },
  {
    index: "02",
    title: "Set a key",
    body: "XAI_API_KEY or GROK_API_KEY, or OPENAI_API_KEY with UI_GEN_BASE_URL. A missing key exits before any network call.",
    code: "export XAI_API_KEY=…",
  },
  {
    index: "03",
    title: "Generate from a prompt",
    body: "The model returns one component with a named export. ui-gen writes the .tsx file and updates index.ts.",
    code: 'ui-gen generate "pricing card"',
  },
  {
    index: "04",
    title: "Import what you own",
    body: "The file is in your tree. Change it, commit it, or delete it. There is no registry to stay in sync with.",
    code: 'import { PricingCard } from\n"@/components/ui/pricing-card"',
  },
]

const tools: { name: string; kind: string }[] = [
  { name: "init_project", kind: "write" },
  { name: "generate_component", kind: "write" },
  { name: "add_component", kind: "write" },
  { name: "list_components", kind: "read" },
  { name: "get_project_config", kind: "read" },
]

export function HowItWorks({ id = "how-it-works", className }: HowItWorksProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 border-t border-border", className)}>
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16 lg:px-8 lg:py-32">
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">How it works</p>
          <h2 className="mt-4 max-w-lg font-display text-4xl tracking-[-0.03em] text-balance sm:text-5xl">
            From a prompt to an import.
          </h2>
          <ol className="mt-10">
            {steps.map((step) => (
              <li key={step.index} className="relative grid gap-3 border-l border-border py-6 pl-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] sm:items-start">
                <span className="absolute top-7 -left-3 grid size-6 place-items-center rounded-full border border-border bg-background font-mono text-[10px] text-muted-foreground">
                  {step.index}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-medium tracking-tight">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </div>
                <pre className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs leading-5 whitespace-pre-wrap text-foreground">
                  <code>{step.code}</code>
                </pre>
              </li>
            ))}
          </ol>
        </div>
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:sticky lg:top-24">
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">MCP</p>
          <h3 className="mt-3 font-display text-3xl tracking-tight">Same pipeline, from an agent.</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            <code className="font-mono text-foreground">ui-gen-mcp</code> speaks stdio. It does not generate on its own.
          </p>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {tools.map((tool) => (
              <li key={tool.name} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 truncate font-mono text-xs">{tool.name}</span>
                <span className="shrink-0 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">{tool.kind}</span>
              </li>
            ))}
          </ul>
          <pre className="mt-6 overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs leading-6 text-muted-foreground">
            <code>
              {`{
  "mcpServers": {
    "ui-gen": {
      "command": "ui-gen-mcp"
    }
  }
}`}
            </code>
          </pre>
        </aside>
      </div>
    </section>
  )
}

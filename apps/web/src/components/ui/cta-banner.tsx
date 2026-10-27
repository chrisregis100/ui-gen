import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const costs = [
  {
    title: "The tool",
    body: "MIT license. No fee for the CLI or the MCP server in this repository.",
  },
  {
    title: "The model",
    body: "Generate calls are billed by your provider. The default is xAI, model grok-4.7, at https://api.x.ai/v1.",
  },
  {
    title: "The files",
    body: "A .tsx component and an index.ts export land in your components directory. Nothing is hosted for you.",
  },
] as const

const commands = `pnpm install
pnpm build
pnpm ui-gen init
pnpm ui-gen generate "accessible search input"`

export interface CtaBannerProps {
  className?: string
}

export function CtaBanner({ className }: CtaBannerProps) {
  return (
    <section
      id="open-source"
      aria-labelledby="open-source-title"
      className={cn("scroll-mt-20 border-t border-border", className)}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:px-8">
        <div>
          <p className="font-mono text-sm text-muted-foreground">Open source</p>
          <h2
            id="open-source-title"
            className="mt-3 font-display text-4xl tracking-tight text-balance sm:text-5xl"
          >
            Your repo. Your key.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            ui-gen is maintained by Régis KIKI. Run it from a checkout of this tree. There is no
            hosted component registry and no ui-gen subscription in this release.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#how-it-works"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground hover:bg-accent/90",
                focusRing,
              )}
            >
              Read the commands
            </a>
            <a
              href="#demo"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium hover:bg-muted",
                focusRing,
              )}
            >
              Look at the output
            </a>
          </div>
          <pre
            tabIndex={0}
            aria-label="Commands to build ui-gen and generate a component"
            className="mt-8 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-border bg-card p-4 font-mono text-sm leading-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <code>{commands}</code>
          </pre>
        </div>
        <ul className="grid gap-3">
          {costs.map((cost) => (
            <li key={cost.title}>
              <article className="h-full rounded-2xl border border-border bg-card p-5">
                <h3 className="text-base font-medium">{cost.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{cost.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

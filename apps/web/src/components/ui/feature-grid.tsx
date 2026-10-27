import { cn } from "@/lib/utils"

export interface FeatureGridProps {
  className?: string
}

const files = [
  "src/components/ui/pricing-card.tsx",
  "src/components/ui/index.ts",
]

export function FeatureGrid({ className }: FeatureGridProps) {
  return (
    <section id="features" className={cn("scroll-mt-24 border-t border-border", className)}>
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">What it writes</p>
          <h2 className="mt-4 font-display text-4xl tracking-[-0.03em] text-balance sm:text-5xl">
            A component you can read.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Not a runtime package. A file, a named export, and one line added to the barrel. You review the diff and commit it like any other source.
          </p>
        </div>
        <div className="mt-14 grid gap-3 md:grid-cols-6">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:col-span-4 md:row-span-2 md:p-8">
            <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Copied in</p>
            <h3 className="mt-3 max-w-md font-display text-3xl tracking-tight sm:text-4xl">
              The file lands in the directory you named.
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              <code className="font-mono text-foreground">generate</code> writes <code className="font-mono text-foreground">ComponentName.tsx</code> under the path in <code className="font-mono text-foreground">ui-gen.json</code>. <code className="font-mono text-foreground">add</code> copies a local file that already has a named export.
            </p>
            <ul className="mt-8 overflow-hidden rounded-xl border border-border bg-background">
              {files.map((file) => (
                <li key={file} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
                  <span className="min-w-0 truncate font-mono text-xs text-foreground">{file}</span>
                  <span className="shrink-0 font-mono text-[10px] tracking-wide text-accent uppercase">new</span>
                </li>
              ))}
              <li className="px-4 py-3 font-mono text-xs text-[#9dba8a]">
                + export {"{"} PricingCard {"}"} from &quot;./pricing-card&quot;
              </li>
            </ul>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">CLI</p>
            <h3 className="mt-3 text-lg tracking-tight">One command from the terminal.</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              <code className="font-mono text-foreground">ui-gen</code> and <code className="font-mono text-foreground">ui-gen-mcp</code> both call <code className="font-mono text-foreground">@ui-gen/core</code>.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">MCP</p>
            <h3 className="mt-3 text-lg tracking-tight">The same tools, from an agent.</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              init, generate, add, list, and read config. No second generator behind the protocol.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">Paths</p>
            <h3 className="mt-3 text-lg tracking-tight">Your alias, not ours.</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Init reads Next.js, Vite, or React, plus <code className="font-mono text-foreground">components.json</code> and <code className="font-mono text-foreground">tsconfig</code> paths. The import line uses that alias.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">Provider</p>
            <h3 className="mt-3 text-lg tracking-tight">Your key. Any compatible endpoint.</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Default is xAI, <code className="font-mono text-foreground">grok-4.7</code>, <code className="font-mono text-foreground">https://api.x.ai/v1</code>. Set <code className="font-mono text-foreground">UI_GEN_BASE_URL</code> for another OpenAI-compatible API.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

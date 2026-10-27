import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const heroSnippet = `export interface PricingCardProps {
  name: string
  price: string
  summary: string
}

export function PricingCard({ name, price, summary }: PricingCardProps) {
  return (
    <article aria-labelledby="plan-name">
      <h2 id="plan-name">{name}</h2>
      <p>{price}</p>
      <p>{summary}</p>
    </article>
  )
}`

const facts = [
  { term: "Export", detail: "Named function" },
  { term: "Import", detail: "Your path alias" },
  { term: "License", detail: "MIT" },
] as const

export interface HeroProps {
  className?: string
}

export function Hero({ className }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className={cn("relative overflow-hidden", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:px-8 lg:py-28">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-sm text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            CLI and MCP · one pipeline
          </p>
          <h1
            id="hero-title"
            className="mt-6 max-w-xl font-display text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            A prompt goes in.
            <span className="mt-1 block italic text-accent">A file stays.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-pretty text-muted-foreground">
            ui-gen writes a React, TypeScript, and Tailwind component into your repository. The
            source is yours, the same way the shadcn CLI copies a file instead of shipping a locked
            package.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#how-it-works"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground hover:bg-accent/90",
                focusRing,
              )}
            >
              How it works
            </a>
            <a
              href="#demo"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium hover:bg-muted",
                focusRing,
              )}
            >
              See a generated file
            </a>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-muted-foreground">
            The sections on this page live in{" "}
            <span className="font-mono text-foreground">src/components/ui</span>.
          </p>
          <dl className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className="font-mono text-xs text-muted-foreground">{fact.term}</dt>
                <dd className="mt-1 text-sm font-medium">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_-48px_rgba(20,22,14,0.55)]">
          <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 font-mono text-xs text-muted-foreground">
            <span>src/components/ui/pricing-card.tsx</span>
            <span className="shrink-0">named export</span>
          </figcaption>
          <pre
            tabIndex={0}
            aria-label="Excerpt of a generated pricing card"
            className="overflow-x-auto p-4 font-mono text-[13px] leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <code>{heroSnippet}</code>
          </pre>
          <div className="space-y-2 border-t border-border bg-muted px-4 py-3 font-mono text-xs leading-5">
            <p>
              <span className="text-accent">$</span> pnpm ui-gen generate &quot;pricing card with
              three tiers&quot;
            </p>
            <p className="text-foreground">
              import {"{ PricingCard }"} from &quot;@/components/ui/pricing-card&quot;;
            </p>
          </div>
        </figure>
      </div>
    </section>
  )
}

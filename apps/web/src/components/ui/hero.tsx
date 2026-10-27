import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroProps {
  installHref?: string
  seeHowHref?: string
  className?: string
}

interface TokenProps {
  children: ReactNode
  tone?: "plain" | "key" | "name" | "string" | "tag" | "comment"
}

function Token({ children, tone = "plain" }: TokenProps) {
  const toneClass = {
    plain: "text-foreground",
    key: "text-[#9dba8a]",
    name: "text-[#f4f1ea]",
    string: "text-[#e7c99a]",
    tag: "text-[#8eb8c4]",
    comment: "text-muted-foreground",
  }[tone]
  return <span className={toneClass}>{children}</span>
}

export function Hero({
  installHref = "#how-it-works",
  seeHowHref = "#demo",
  className,
}: HeroProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(244,241,234,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,241,234,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:px-8 lg:py-24">
        <div className="rise min-w-0">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            CLI · MCP · MIT
          </p>
          <h1 className="mt-5 font-display text-[clamp(3.1rem,7.2vw,5.6rem)] leading-[0.92] tracking-[-0.035em] text-balance">
            Generate it.
            <span className="mt-1 block italic text-[#e7d7b8]">Keep the file.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            ui-gen writes a React, TypeScript, and Tailwind component from a prompt and copies it into your repository. The CLI and the MCP server share one pipeline.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={installHref}>How it works</Button>
            <Button href={seeHowHref} variant="secondary">
              See the file
            </Button>
          </div>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-3 border-t border-border pt-5">
            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Output</dt>
              <dd className="mt-1 text-sm">Named export</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Import</dt>
              <dd className="mt-1 text-sm">Your alias</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">License</dt>
              <dd className="mt-1 text-sm">MIT</dd>
            </div>
          </dl>
        </div>
        <figure className="rise rise-delay min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_90px_-48px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.05)]">
          <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
              src/components/ui/pricing-card.tsx
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-accent">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              Written
            </span>
          </figcaption>
          <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.2fr)_12.5rem]">
            <pre className="min-w-0 overflow-x-auto border-b border-border p-4 font-mono text-[12.5px] leading-6 lg:border-r lg:border-b-0">
              <code>
                <Token tone="key">export function </Token>
                <Token>PricingCard</Token>
                <Token>() {"{"}</Token>
                {"\n  "}
                <Token tone="key">return</Token>
                <Token> (</Token>
                {"\n    "}
                <Token tone="tag">&lt;article&gt;</Token>
                {"\n      "}
                <Token tone="tag">&lt;h2&gt;</Token>
                <Token>Pro</Token>
                <Token tone="tag">&lt;/h2&gt;</Token>
                {"\n      "}
                <Token tone="tag">&lt;p&gt;</Token>
                <Token>$29</Token>
                <Token tone="tag">&lt;/p&gt;</Token>
                {"\n    "}
                <Token tone="tag">&lt;/article&gt;</Token>
                {"\n  "}
                <Token>)</Token>
                {"\n"}
                <Token>{"}"}</Token>
              </code>
            </pre>
            <div className="bg-[#f3efe4] p-4 text-[#1c1a16] sm:p-5">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[#6d675c] uppercase">Sample render</p>
              <article className="mt-3 rounded-xl border border-[#ddd6c6] bg-[#faf8f3] p-4 shadow-[0_12px_30px_-20px_rgba(28,26,22,0.45)]">
                <h2 className="text-sm font-medium">Pro</h2>
                <p className="mt-1 font-display text-4xl tracking-tight">$29</p>
                <p className="mt-2 text-sm leading-5 text-[#5c564c]">For a small team.</p>
                <span className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#17160f] px-3 text-xs text-[#f4f1ea]">
                  Use this plan
                </span>
              </article>
            </div>
          </div>
          <div className="border-t border-border px-4 py-3 font-mono text-xs leading-5 break-words text-muted-foreground">
            <span className="text-accent">$</span> ui-gen generate &quot;pricing card with three tiers&quot;
          </div>
        </figure>
      </div>
    </section>
  )
}

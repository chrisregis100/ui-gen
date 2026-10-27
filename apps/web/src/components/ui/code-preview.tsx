"use client"

import { Check, Copy } from "lucide-react"
import { useEffect, useState, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const pricingCardSource = `export interface PricingCardProps {
  tiers: Array<{
    name: string
    price: string
    summary: string
    features: string[]
    cta: string
    featured?: boolean
  }>
}

export function PricingCard({ tiers }: PricingCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tiers.map((tier) => (
        <article
          key={tier.name}
          className={
            tier.featured
              ? "flex flex-col gap-4 rounded-2xl border border-neutral-900 bg-neutral-900 p-5 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
              : "flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
          }
        >
          <header>
            <h3 className="text-sm font-medium opacity-80">{tier.name}</h3>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{tier.price}</p>
          </header>
          <p className="text-sm leading-6 opacity-90">{tier.summary}</p>
          <ul className="flex list-disc flex-col gap-2 pl-4 text-sm leading-6">
            {tier.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <button
            type="button"
            className={
              tier.featured
                ? "mt-auto inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 dark:bg-neutral-950 dark:text-white dark:focus-visible:ring-neutral-950 dark:focus-visible:ring-offset-neutral-100"
                : "mt-auto inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-neutral-100 dark:text-neutral-950 dark:focus-visible:ring-neutral-100 dark:focus-visible:ring-offset-neutral-950"
            }
          >
            {tier.cta}
          </button>
        </article>
      ))}
    </div>
  )
}`

interface Tier {
  name: string
  price: string
  summary: string
  features: string[]
  cta: string
  featured?: boolean
}

const sampleTiers: Tier[] = [
  {
    name: "Solo",
    price: "$0",
    summary: "A single workspace for trying the interface.",
    features: ["One project", "Local preview"],
    cta: "Choose Solo",
  },
  {
    name: "Studio",
    price: "$29",
    summary: "Shared components for a small team.",
    features: ["Shared files", "Review notes"],
    cta: "Choose Studio",
    featured: true,
  },
  {
    name: "Org",
    price: "$99",
    summary: "A wider review workflow.",
    features: ["More seats", "Audit history"],
    cta: "Choose Org",
  },
]

interface Panel {
  label: string
  path: string
  code: string
  note: string
}

const panels: Panel[] = [
  {
    label: "Prompt",
    path: "ui-gen generate",
    code: 'pricing card with three tiers and a primary CTA',
    note: "This is the text passed to generate. The model is asked for JSON with name, description, and code.",
  },
  {
    label: "File",
    path: "src/components/ui/pricing-card.tsx",
    code: pricingCardSource,
    note: "A successful generate writes this file and appends an export to index.ts in the same directory.",
  },
  {
    label: "Import",
    path: "the page that renders it",
    code: 'import { PricingCard } from "@/components/ui/pricing-card";',
    note: "ui-gen prints this line when the alias recorded at init maps @/* onto ./src/*.",
  },
]

export interface CodePreviewProps {
  className?: string
}

export function CodePreview({ className }: CodePreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
  const active = panels[activeIndex] ?? panels[0]

  useEffect(() => {
    if (copyState === "idle") return
    const timeout = window.setTimeout(() => setCopyState("idle"), 2000)
    return () => window.clearTimeout(timeout)
  }, [copyState])

  const handleSelectTab = (index: number) => {
    setActiveIndex(index)
    setCopyState("idle")
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = panels.length - 1
    let next = index
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = last
    else return
    event.preventDefault()
    handleSelectTab(next)
    document.getElementById(`code-tab-${next}`)?.focus()
  }

  const handleCopy = async () => {
    if (!active) return
    try {
      if (!navigator.clipboard) {
        setCopyState("failed")
        return
      }
      await navigator.clipboard.writeText(active.code)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  const copyLabel =
    copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy unavailable" : "Copy"

  return (
    <section
      id="demo"
      aria-labelledby="demo-title"
      className={cn("scroll-mt-20 border-t border-border", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-muted-foreground">Demo</p>
          <h2 id="demo-title" className="mt-3 font-display text-4xl tracking-tight text-balance sm:text-5xl">
            The file for that prompt.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Sample output for a pricing card. These prices are part of the example component. They
            are not what ui-gen charges. The tool’s own terms are in the open-source section.
          </p>
        </div>
        <div className="mt-12 space-y-6">
          <PricingPreview tiers={sampleTiers} />
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div role="tablist" aria-label="Generated file views" className="flex flex-wrap gap-1">
                {panels.map((panel, index) => {
                  const isSelected = index === activeIndex
                  return (
                    <button
                      key={panel.label}
                      id={`code-tab-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-controls="code-panel"
                      tabIndex={isSelected ? 0 : -1}
                      className={cn(
                        "h-9 rounded-full px-3 text-sm",
                        isSelected ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted",
                        focusRing,
                      )}
                      onClick={() => handleSelectTab(index)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                    >
                      {panel.label}
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                className={cn(
                  "inline-flex h-9 items-center justify-center gap-2 self-start rounded-full border border-border px-3 text-sm hover:bg-muted",
                  focusRing,
                )}
                onClick={handleCopy}
              >
                {copyState === "copied" ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : (
                  <Copy aria-hidden="true" className="size-4" />
                )}
                <span aria-live="polite">{copyLabel}</span>
              </button>
            </div>
            {active ? (
              <div role="tabpanel" id="code-panel" aria-labelledby={`code-tab-${activeIndex}`}>
                <p className="border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
                  {active.path}
                </p>
                <pre
                  tabIndex={0}
                  aria-label={`${active.label} contents`}
                  className="max-h-[32rem] overflow-auto p-4 font-mono text-[13px] leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <code>{active.code}</code>
                </pre>
                <p className="border-t border-border px-4 py-3 text-sm leading-6 text-muted-foreground">
                  {active.note}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

interface PricingPreviewProps {
  tiers: Tier[]
}

function PricingPreview({ tiers }: PricingPreviewProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-3 sm:p-4">
      <p className="px-1 pb-3 font-mono text-xs text-muted-foreground">Example render</p>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={
              tier.featured
                ? "flex flex-col gap-4 rounded-2xl border border-neutral-900 bg-neutral-900 p-5 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
                : "flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
            }
          >
            <header>
              <h3 className="text-sm font-medium opacity-80">{tier.name}</h3>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{tier.price}</p>
            </header>
            <p className="text-sm leading-6 opacity-90">{tier.summary}</p>
            <ul className="flex list-disc flex-col gap-2 pl-4 text-sm leading-6">
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button
              type="button"
              className={
                tier.featured
                  ? "mt-auto inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 dark:bg-neutral-950 dark:text-white dark:focus-visible:ring-neutral-950 dark:focus-visible:ring-offset-neutral-100"
                  : "mt-auto inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-neutral-100 dark:text-neutral-950 dark:focus-visible:ring-neutral-100 dark:focus-visible:ring-offset-neutral-950"
              }
            >
              {tier.cta}
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

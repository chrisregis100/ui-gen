"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CodePreviewProps {
  prompt?: string
  code?: string
  className?: string
}

interface Tier {
  name: string
  price: string
  description: string
  features: string[]
  featured?: boolean
}

const tiers: Tier[] = [
  {
    name: "Solo",
    price: "$0",
    description: "A single workspace for trying the interface.",
    features: ["One project", "Local preview"],
  },
  {
    name: "Studio",
    price: "$29",
    description: "Shared components for a small team.",
    features: ["Shared files", "Review notes"],
    featured: true,
  },
  {
    name: "Org",
    price: "$99",
    description: "A wider review workflow.",
    features: ["More seats", "Audit history"],
  },
]

const defaultCode = `export function PricingCard() {
  return (
    <article className="rounded-2xl border p-6">
      <h2>Pro</h2>
      <p className="text-4xl">$29</p>
      <p>Shared components for a small team.</p>
    </article>
  )
}
`

type Tab = "prompt" | "code" | "import"

const tabs: { id: Tab; label: string }[] = [
  { id: "prompt", label: "Prompt" },
  { id: "code", label: "File" },
  { id: "import", label: "Import" },
]

export function CodePreview({
  prompt = "pricing card with three tiers and a primary CTA",
  code = defaultCode,
  className,
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("prompt")
  const [isCopied, setIsCopied] = useState(false)

  const importLine = `import { PricingCard } from "@/components/ui/pricing-card"`
  const activeText = activeTab === "prompt" ? prompt : activeTab === "code" ? code : importLine

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeText)
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 2000)
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <section id="demo" className={cn("scroll-mt-24 border-t border-border", className)}>
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Demo</p>
          <h2 className="mt-4 font-display text-4xl tracking-[-0.03em] text-balance sm:text-5xl">
            The file for that prompt.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Sample output for a pricing card. These prices are part of the example. They are not ui-gen charges. The tool is MIT, and generate calls are billed by your model provider.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-[#f3efe4] text-[#1c1a16] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#ddd6c6] px-4 py-3 sm:px-5">
            <p className="font-mono text-[11px] tracking-[0.16em] text-[#6d675c] uppercase">Example render</p>
            <p className="font-mono text-[11px] text-[#6d675c]">pricing-card.tsx</p>
          </div>
          <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={cn(
                  "flex flex-col rounded-xl border p-5",
                  tier.featured
                    ? "border-[#17160f] bg-[#17160f] text-[#f4f1ea]"
                    : "border-[#ddd6c6] bg-[#faf8f3] text-[#1c1a16]",
                )}
              >
                <h3 className="text-sm font-medium">{tier.name}</h3>
                <p className="mt-2 font-display text-4xl tracking-tight">{tier.price}</p>
                <p className={cn("mt-2 text-sm leading-5", tier.featured ? "text-[#c8c2b6]" : "text-[#5c564c]")}>
                  {tier.description}
                </p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span aria-hidden="true" className={tier.featured ? "text-accent" : "text-[#1b473b]"}>
                        ·
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={cn(
                    "mt-6 inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium",
                    tier.featured
                      ? "bg-[#f4f1ea] text-[#17160f]"
                      : "bg-[#17160f] text-[#f4f1ea]",
                  )}
                >
                  Choose {tier.name}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div role="group" aria-label="Generated file" className="flex gap-1">
              {tabs.map((tab) => {
                const isSelected = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setIsCopied(false)
                    }}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors",
                      isSelected ? "bg-foreground text-background" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-9 items-center gap-2 self-start rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
              aria-label={isCopied ? "Copied" : "Copy current panel"}
            >
              {isCopied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="min-w-0">
            <pre className="max-h-80 overflow-auto p-4 font-mono text-[13px] leading-6 whitespace-pre-wrap sm:p-5">
              <code>{activeText}</code>
            </pre>
            <p className="border-t border-border px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
              {activeTab === "prompt"
                ? "This is the text passed to generate. The model is asked for JSON with name, description, and code."
                : activeTab === "code"
                  ? "The CLI writes this into the components directory and exports the named function from index.ts."
                  : "The alias comes from tsconfig or components.json. It is not hard-coded to @/."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

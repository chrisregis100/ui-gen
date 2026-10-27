import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const pageLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#demo", label: "Demo" },
  { href: "#open-source", label: "Open source" },
] as const

const packages = [
  { name: "@ui-gen/cli", detail: "binary ui-gen" },
  { name: "@ui-gen/core", detail: "generation and file writes" },
  { name: "@ui-gen/mcp", detail: "binary ui-gen-mcp" },
] as const

export interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t border-border", className)}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl tracking-tight">ui-gen</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            React, TypeScript, and Tailwind components, written into your project from a prompt.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">© 2026 Régis KIKI. MIT License.</p>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-medium">On this page</p>
          <ul className="mt-3 space-y-2">
            {pageLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "rounded-md text-sm text-muted-foreground hover:text-foreground",
                    focusRing,
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-medium">Packages in this repo</p>
          <ul className="mt-3 space-y-3">
            {packages.map((pkg) => (
              <li key={pkg.name}>
                <p className="font-mono text-sm">{pkg.name}</p>
                <p className="text-sm text-muted-foreground">{pkg.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            This page imports its sections from{" "}
            <span className="font-mono text-foreground">src/components/ui</span>. A public GitHub
            remote is not attached to this tree yet.
          </p>
          <a href="#top" className={cn("w-fit rounded-md hover:text-foreground", focusRing)}>
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}

import { cn } from "@/lib/utils"

export interface FooterProps {
  blurb?: string
  docsHref?: string
  cliHref?: string
  mcpHref?: string
  licenseHref?: string
  year?: number
  className?: string
}

const packages = [
  { name: "@ui-gen/core", note: "generate and write" },
  { name: "ui-gen", note: "terminal CLI" },
  { name: "ui-gen-mcp", note: "stdio MCP server" },
]

export function Footer({
  blurb = "A prompt in. A React, TypeScript, and Tailwind file in your project.",
  docsHref = "#demo",
  cliHref = "#how-it-works",
  mcpHref = "#how-it-works",
  licenseHref = "#get-started",
  year = 2026,
  className,
}: FooterProps) {
  const pageLinks = [
    { label: "Demo", href: docsHref },
    { label: "CLI", href: cliHref },
    { label: "MCP", href: mcpHref },
    { label: "License", href: licenseHref },
  ]

  return (
    <footer className={cn("border-t border-border", className)}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,1fr)] lg:px-8">
        <div className="min-w-0">
          <a href="#top" className="inline-flex items-center gap-2 rounded-md">
            <span aria-hidden="true" className="grid size-6 place-items-center rounded-md border border-border bg-card font-mono text-[10px] text-accent">
              ui
            </span>
            <span className="text-sm font-medium">ui-gen</span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{blurb}</p>
          <p className="mt-4 max-w-sm text-xs leading-5 text-muted-foreground">
            A public GitHub remote is not attached yet. The license in this repository is MIT.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">On this page</p>
          <ul className="mt-4 space-y-2">
            {pageLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-foreground/90 hover:text-foreground">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">Packages</p>
          <ul className="mt-4 space-y-3">
            {packages.map((pkg) => (
              <li key={pkg.name} className="min-w-0">
                <p className="truncate font-mono text-sm">{pkg.name}</p>
                <p className="text-xs text-muted-foreground">{pkg.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} Régis KIKI. MIT License.</p>
          <a href="#top" className="hover:text-foreground">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}

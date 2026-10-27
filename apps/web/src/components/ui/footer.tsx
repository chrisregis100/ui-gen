export interface FooterProps {
  className?: string;
  productName?: string;
  blurb?: string;
  docsHref?: string;
  cliHref?: string;
  mcpHref?: string;
  licenseHref?: string;
  year?: number;
  author?: string;
}

export function Footer({
  className,
  productName = "ui-gen",
  blurb = "AI UI component generator",
  docsHref = "/docs",
  cliHref = "/cli",
  mcpHref = "/mcp",
  licenseHref = "/license",
  year = 2026,
  author = "Régis KIKI",
}: FooterProps) {
  const links = [
    { label: "Docs", href: docsHref },
    { label: "CLI", href: cliHref },
    { label: "MCP", href: mcpHref },
    { label: "License", href: licenseHref },
  ];

  return (
    <footer
      className={[
        "border-t border-zinc-200 bg-zinc-50 text-zinc-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:px-8">
        <div className="max-w-sm">
          <p className="text-base font-semibold tracking-tight text-zinc-950">
            {productName}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{blurb}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="rounded-sm text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-zinc-200">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-zinc-500 sm:px-6 lg:px-8">
          © {year} {author}
        </p>
      </div>
    </footer>
  );
}

"use client"

export interface HeroProps {
  installHref?: string;
  seeHowHref?: string;
  onInstall?: () => void;
  onSeeHow?: () => void;
}

export function Hero({
  installHref = "#install",
  seeHowHref = "#how-it-works",
  onInstall,
  onSeeHow,
}: HeroProps) {
  const sampleSource = [
    "export function PricingCard() {",
    "  return (",
    '    <article className="rounded-2xl border p-6">',
    "      <h2>Pro</h2>",
    "      <p>Ship faster with generated UI.</p>",
    "    </article>",
    "  )",
    "}",
  ].join("\n");

  return (
    <section
      aria-labelledby="ui-gen-hero-heading"
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600/25 via-slate-950 to-fuchsia-600/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            ui-gen
          </p>
          <h1
            id="ui-gen-hero-heading"
            className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Generate React UI components with AI
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Describe a component. Get TypeScript Tailwind source copied into your project via CLI or MCP.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={installHref}
              onClick={onInstall}
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Install the CLI
            </a>
            <a
              href={seeHowHref}
              onClick={onSeeHow}
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              See how it works
            </a>
          </div>
        </div>
        <aside
          aria-label="Generated TypeScript Tailwind source"
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-indigo-950/40 backdrop-blur sm:p-6"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <p className="font-mono text-xs text-slate-400">PricingCard.tsx</p>
            <p className="text-xs font-medium text-emerald-300">Copied via CLI</p>
          </div>
          <pre className="mt-4 overflow-x-auto font-mono text-xs leading-6 text-indigo-100 sm:text-sm">
            <code>{sampleSource}</code>
          </pre>
        </aside>
      </div>
    </section>
  );
}

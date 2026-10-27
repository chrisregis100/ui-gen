import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CtaBannerProps {
  supportingText?: string
  className?: string
}

const commands = `pnpm dlx ui-gen init
export XAI_API_KEY=your_key
ui-gen generate "a pricing card with three tiers"`

export function CtaBanner({
  supportingText = "ui-gen is MIT and maintained by Régis KIKI. There is no hosted registry and no ui-gen subscription. Generate calls are billed by your model provider.",
  className,
}: CtaBannerProps) {
  return (
    <section id="get-started" className={cn("scroll-mt-24 border-t border-border", className)}>
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-[0.22em] text-accent uppercase">Open source</p>
            <h2 className="mt-4 font-display text-[clamp(3rem,6vw,5.25rem)] leading-[0.92] tracking-[-0.035em]">
              Your repo.
              <span className="block italic text-[#e7d7b8]">Your key.</span>
            </h2>
          </div>
          <div className="min-w-0">
            <p className="text-base leading-7 text-muted-foreground">{supportingText}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="#how-it-works">Read the commands</Button>
              <Button href="#demo" variant="secondary">
                See the file
              </Button>
            </div>
          </div>
        </div>
        <pre className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card p-5 font-mono text-sm leading-7 whitespace-pre-wrap text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <code>{commands}</code>
        </pre>
      </div>
    </section>
  )
}

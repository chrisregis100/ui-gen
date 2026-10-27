"use client"

import { useId } from "react"

export interface CtaBannerProps {
  supportingText?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  className?: string
}

export function CtaBanner({
  supportingText = "Generate accessible React components from a short brief, style them with Tailwind, and ship the interface without a long design cycle.",
  onPrimaryClick,
  onSecondaryClick,
  className = "",
}: CtaBannerProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={`w-full border-y border-slate-800 bg-slate-950 text-slate-50 ${className}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8 lg:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
            Open source ui-gen
          </p>
          <h2
            id={titleId}
            className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            Ship UI faster with open source ui-gen
          </h2>
          <p
            id={descriptionId}
            className="mt-3 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            {supportingText}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="#how-it-works"
            onClick={onPrimaryClick}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Get started
          </a>
          <a
            href="#demo"
            onClick={onSecondaryClick}
            className="inline-flex items-center justify-center rounded-lg border border-slate-500 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Read docs
          </a>
        </div>
      </div>
    </section>
  )
}

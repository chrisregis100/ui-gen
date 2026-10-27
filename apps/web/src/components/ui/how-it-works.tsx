"use client"

import { useId } from "react";

export interface HowItWorksProps {
  id?: string;
  className?: string;
  headingId?: string;
  title?: string;
  description?: string;
}

const steps = [
  {
    label: "01",
    title: "Init writes ui-gen.json",
    body: "Run init in the project you want to generate into. ui-gen writes ui-gen.json, the manifest that records output paths and how new components are exported.",
    note: "Writes ui-gen.json",
    code: "ui-gen init",
  },
  {
    label: "02",
    title: "Generate from a prompt",
    body: "Describe the interface you need in a prompt. ui-gen reads ui-gen.json and generates the component from that brief.",
    note: "Prompt in",
    code: "ui-gen generate",
  },
  {
    label: "03",
    title: "Component lands as tsx with index export",
    body: "The finished component lands as a .tsx file. ui-gen adds a named export to the index so it can be imported without a deep path.",
    note: "tsx plus index export",
    code: "ComponentName.tsx\nexport { ComponentName } from './ComponentName';",
  },
] as const;

export function HowItWorks({
  id,
  className,
  headingId,
  title = "How it works",
  description = "Three steps: init writes ui-gen.json, generate from a prompt, and the component lands as tsx with an index export.",
}: HowItWorksProps) {
  const autoHeadingId = useId();
  const labelId = headingId ?? autoHeadingId;

  return (
    <section
      id={id}
      aria-labelledby={labelId}
      className={[
        "border-y border-slate-200 bg-slate-50 text-slate-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            ui-gen
          </p>
          <h2
            id={labelId}
            className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            {description}
          </p>
        </div>
        <ol className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.label}
              className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 font-mono text-sm font-semibold text-white"
                >
                  {step.label}
                </span>
                <h3 className="pt-1.5 text-base font-semibold leading-6 tracking-tight text-slate-950">
                  {step.title}
                </h3>
              </div>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                {step.body}
              </p>
              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-600">
                {step.note}
              </p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 px-3 py-3 font-mono text-xs leading-5 text-emerald-100">
                <code>{step.code}</code>
              </pre>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

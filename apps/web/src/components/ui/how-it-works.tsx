import { cn } from "@/lib/utils"

interface Step {
  title: string
  body: string
  code?: string
  codeLabel: string
}

const cliSteps: Step[] = [
  {
    title: "Initialize the project",
    body: "Detects Next.js, Vite, or React, including components.json and tsconfig aliases. Writes ui-gen.json. The default components directory is src/components/ui.",
    code: "ui-gen init",
    codeLabel: "Initialize command",
  },
  {
    title: "Set a provider key",
    body: "Put XAI_API_KEY or GROK_API_KEY in .env. OPENAI_API_KEY is used with UI_GEN_BASE_URL for any other OpenAI-compatible endpoint. ui-gen does not override variables that are already set.",
    code: "XAI_API_KEY=your-key",
    codeLabel: "Environment variable",
  },
  {
    title: "Generate a component",
    body: "The model returns JSON with name, description, and code. ui-gen checks for a named export, writes the .tsx file, and updates index.ts.",
    code: 'ui-gen generate "pricing card with three tiers"',
    codeLabel: "Generate command",
  },
  {
    title: "Import the file",
    body: "The alias comes from tsconfig. Add @/* if your project does not have it yet. Then edit the component like any other source file.",
    code: 'import { PricingCard } from "@/components/ui/pricing-card";',
    codeLabel: "Import line",
  },
]

const mcpSteps: Step[] = [
  {
    title: "Run the stdio server",
    body: "ui-gen-mcp speaks MCP on stdout and logs to stderr. It calls the same @ui-gen/core pipeline as the CLI.",
    code: "ui-gen-mcp",
    codeLabel: "MCP server command",
  },
  {
    title: "Call the tools",
    body: "init_project, generate_component, and add_component write files. list_components and get_project_config are read-only.",
    code: "generate_component",
    codeLabel: "Write tool",
  },
  {
    title: "Point an agent at it",
    body: "Use the binary when it is on PATH and the key is already in the environment that launches the server. Otherwise run node on packages/mcp/dist/index.js and pass the key in that process env. Do not commit the key.",
    code: `{
  "mcpServers": {
    "ui-gen": {
      "command": "ui-gen-mcp"
    }
  }
}`,
    codeLabel: "Cursor MCP config",
  },
]

export interface HowItWorksProps {
  className?: string
}

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className={cn("scroll-mt-20 border-t border-border", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-muted-foreground">How it works</p>
          <h2 id="how-title" className="mt-3 font-display text-4xl tracking-tight text-balance sm:text-5xl">
            A terminal, or the agent you already use.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Both entry points write into the components directory from ui-gen.json. A missing API
            key stops the command before any network call.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <WorkflowColumn kicker="@ui-gen/cli" title="From the terminal" steps={cliSteps} />
          <WorkflowColumn kicker="@ui-gen/mcp" title="From a coding agent" steps={mcpSteps} />
        </div>
        <p className="mt-6 text-sm leading-6 text-muted-foreground">
          <span className="font-mono text-foreground">ui-gen add ./DraftCard.tsx</span> copies a
          local component that already has a named export and updates the barrel.
        </p>
      </div>
    </section>
  )
}

interface WorkflowColumnProps {
  kicker: string
  title: string
  steps: Step[]
}

function WorkflowColumn({ kicker, title, steps }: WorkflowColumnProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <p className="font-mono text-sm text-muted-foreground">{kicker}</p>
      <h3 className="mt-2 text-xl font-medium tracking-tight">{title}</h3>
      <ol className="mt-6 space-y-6">
        {steps.map((step, index) => (
          <li key={step.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
            <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <h4 className="text-sm font-medium">{step.title}</h4>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.body}</p>
              {step.code ? (
                <pre
                  tabIndex={0}
                  aria-label={step.codeLabel}
                  className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-muted px-3 py-2 font-mono text-sm leading-6 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <code>{step.code}</code>
                </pre>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}

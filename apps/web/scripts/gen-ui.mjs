/**
 * Regenerates the landing sections with the ui-gen CLI.
 *
 *   pnpm build
 *   pnpm --filter web gen:ui
 *
 * Requires XAI_API_KEY, GROK_API_KEY, or OPENAI_API_KEY in the environment
 * or in apps/web/.env. ui-gen exits with missing_api_key and does not call
 * the network when no key is set. This script does not embed a key.
 */
import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = path.resolve(appRoot, "../..")
const cli = path.join(repoRoot, "packages/cli/dist/index.js")

const style = [
  "Match ui-gen conventions: TypeScript, a named function export, an exported props interface named <ComponentName>Props, Tailwind utility classes only, semantic elements, visible focus-visible:ring, and a responsive layout.",
  'This Next.js app uses React Server Components. Add "use client" as the first line only when the component uses state, effects, or event handlers.',
  "You may import from react, lucide-react, and the cn helper at @/lib/utils. Do not import anything else.",
  "Style with the existing theme tokens: bg-background, text-foreground, text-muted-foreground, bg-muted, bg-card, border-border, bg-accent, text-accent-foreground, ring-ring, font-sans, font-mono, font-display.",
  "ui-gen is an MIT CLI and MCP server maintained by Régis KIKI. It generates one React + TypeScript + Tailwind component and writes the file into the user's project. The unscoped npm name ui-gen is already taken; packages are @ui-gen/cli, @ui-gen/core, and @ui-gen/mcp. The default model provider is xAI grok-4.7 at https://api.x.ai/v1. OPENAI_API_KEY works with UI_GEN_BASE_URL.",
  "Do not invent a public GitHub URL, a star count, a hosted registry, or a paid ui-gen plan. Model calls are billed by the user's provider. There is no ui-gen subscription.",
  "No lorem ipsum, no CSS modules, no inline style objects, no default export, and no comments that restate the code.",
].join(" ")

const sections = [
  {
    name: "Navbar",
    prompt: `${style}

Build the sticky site header for the ui-gen marketing page. Export NavbarProps with optional brand and version strings defaulting to "ui-gen" and "v0.1". Export function Navbar.

Include a home link to #top with an accessible name, primary links to #features, #how-it-works, #demo, and #open-source, a button that toggles the dark class on documentElement and stores "theme" in localStorage, and a mobile menu button with aria-expanded and aria-controls. Close the mobile menu on Escape and when a link is activated. Use buttons with type="button". Desktop links are hidden below the md breakpoint. Respect prefers-color-scheme only for the initial paint script that already lives in the root layout; this component syncs after mount.`,
  },
  {
    name: "Hero",
    prompt: `${style}

Build the marketing hero. Export HeroProps with optional className. Export function Hero. Render a section labelled by an h1 id="hero-title".

Copy: eyebrow "CLI and MCP · one pipeline". Headline "A prompt goes in." and an italic second line "A file stays." Paragraph explaining that ui-gen writes a React, TypeScript, and Tailwind component into the repository, like the shadcn CLI copying a file instead of shipping a locked package. Links "How it works" (#how-it-works, accent button) and "See a generated file" (#demo, bordered button). A note that the sections on this page live in src/components/ui. A definition list: Export / Named function, Import / Your path alias, License / MIT.

Beside the copy, from the lg breakpoint, show a figure with figcaption src/components/ui/pricing-card.tsx, a short code excerpt of a named PricingCard function, the command pnpm ui-gen generate "pricing card with three tiers", and the import line import { PricingCard } from "@/components/ui/pricing-card";. No "use client".`,
  },
  {
    name: "FeatureGrid",
    prompt: `${style}

Build a feature grid section id="features" with scroll-mt-20 and aria-labelledby. Export FeatureGridProps with optional className. Export function FeatureGrid.

Heading: "Written like a component you would keep." Six articles: one file with a named export and props interface; files copied into the project by generate and by ui-gen add; CLI and MCP sharing @ui-gen/core; init detecting Next, Vite, or React plus components.json and tsconfig aliases; OpenAI-compatible provider defaulting to xAI; the file is yours to edit and ui-gen does not install Tailwind, React, or icon packages. Use a responsive grid, one column then two then three. Icons from lucide-react are fine. No "use client".`,
  },
  {
    name: "HowItWorks",
    prompt: `${style}

Build a how-it-works section id="how-it-works" with scroll-mt-20. Export HowItWorksProps with optional className. Export function HowItWorks.

Two columns from lg. First column kicker @ui-gen/cli, title "From the terminal", ordered steps: ui-gen init; set XAI_API_KEY or GROK_API_KEY in .env and mention OPENAI_API_KEY with UI_GEN_BASE_URL; ui-gen generate "pricing card with three tiers" writing a tsx file and index.ts; the import line import { PricingCard } from "@/components/ui/pricing-card";. Second column kicker @ui-gen/mcp, title "From a coding agent": ui-gen-mcp on stdio with logs on stderr; tools init_project, generate_component, add_component, list_components, get_project_config, noting which are writes; a JSON MCP config whose command is ui-gen-mcp when the key is already in the environment. Mention that a missing API key exits before any network call. Mention ui-gen add ./DraftCard.tsx. Put commands in pre elements that can be focused and scroll. No "use client".`,
  },
  {
    name: "CodePreview",
    prompt: `${style}

Build a demo section id="demo" with scroll-mt-20. Export CodePreviewProps with optional className. Export function CodePreview. This component needs state, so start the file with "use client".

Show sample output for the prompt "pricing card with three tiers and a primary CTA". State clearly that any prices in the sample are example component copy and are not what ui-gen charges. Include a rendered example and a tabbed panel with three views: the prompt text, a complete PricingCard.tsx source string with a named export and PricingCardProps, and the import line import { PricingCard } from "@/components/ui/pricing-card";. Tabs use role="tablist", role="tab", role="tabpanel", arrow keys, Home, and End. A copy button uses navigator.clipboard and reports Copied or Copy unavailable through aria-live. Code blocks scroll and are keyboard focusable.`,
  },
  {
    name: "CtaBanner",
    prompt: `${style}

Build the open-source close section id="open-source" with scroll-mt-20. Export CtaBannerProps with optional className. Export function CtaBanner.

Heading "Your repo. Your key." Say ui-gen is maintained by Régis KIKI, that this release has no hosted component registry and no ui-gen subscription, and that someone runs it from a checkout. Three facts: the tool is MIT; model calls are billed by the provider, default xAI grok-4.7 at https://api.x.ai/v1; output is a tsx file plus an index.ts export in the user's components directory. Show these commands in a pre: pnpm install, pnpm build, pnpm ui-gen init, pnpm ui-gen generate "accessible search input". Links back to #how-it-works and #demo. No "use client".`,
  },
  {
    name: "Footer",
    prompt: `${style}

Build the site footer. Export FooterProps with optional className. Export function Footer.

Include the wordmark ui-gen, a one-sentence description, "© 2026 Régis KIKI. MIT License.", links to #features, #how-it-works, #demo, and #open-source, and the workspace packages @ui-gen/cli (binary ui-gen), @ui-gen/core, and @ui-gen/mcp (binary ui-gen-mcp) as text, not outbound links. Say this page imports its sections from src/components/ui and that a public GitHub remote is not attached yet. Include a back-to-top link to #top. No "use client".`,
  },
]

if (!existsSync(cli)) {
  console.error("Build the CLI first: pnpm --filter @ui-gen/cli build")
  process.exit(1)
}

if (!existsSync(path.join(appRoot, "ui-gen.json"))) {
  console.error("Missing apps/web/ui-gen.json. Run ui-gen init from apps/web.")
  process.exit(1)
}

console.log("Regenerating landing sections with ui-gen generate.")
console.log("A missing API key exits before any network call.")

for (const section of sections) {
  console.log(`\n# ${section.name}`)
  const result = spawnSync(
    process.execPath,
    [
      cli,
      "generate",
      section.prompt,
      "--name",
      section.name,
      "--yes",
      "--overwrite",
      "--cwd",
      appRoot,
    ],
    { stdio: "inherit" },
  )
  if (result.status !== 0) process.exit(result.status ?? 1)
}

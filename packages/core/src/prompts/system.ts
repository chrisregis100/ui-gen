export interface PromptContext {
  rsc: boolean
  framework: "next" | "vite" | "react" | "unknown"
  allowLucide: boolean
  cnModule?: string
}

export function allowedImports(context: PromptContext): string[] {
  const imports = ["react"]
  if (context.framework === "next") {
    imports.push("next/link", "next/image")
  }
  if (context.allowLucide) imports.push("lucide-react")
  if (context.cnModule) imports.push(context.cnModule)
  return imports
}

export function buildSystemPrompt(context: PromptContext): string {
  const imports = allowedImports(context)
  const rscRule = context.rsc
    ? 'This project uses React Server Components. Add "use client" as the first line only when the component uses state, effects, refs, or event handlers. Omit it for static markup.'
    : 'This project is not using React Server Components. Do not add "use client".'

  return [
    "You write one production-ready React component for an existing codebase.",
    "Return a JSON object with name, description, and code.",
    'The code field is the complete .tsx file source and must not contain markdown fences.',
    "",
    "Component contract:",
    "- TypeScript and React 18+ function component with a named export. No default export.",
    "- Export a props interface named <ComponentName>Props and type the function with it.",
    "- Style only with Tailwind CSS utility classes. No CSS modules, styled-components, inline style objects, or <style> tags.",
    "- Make the layout responsive when it has more than one region.",
    "- Accessible markup: semantic elements, every input has an associated label, buttons set type, images have alt, interactive elements are keyboard reachable, and focus is visible with focus-visible:ring.",
    "- Write copy that matches the request. Do not use lorem ipsum.",
    `- Import only from: ${imports.join(", ")}.`,
    "- One file. No TODO placeholders. No comments that restate the code.",
    `- ${rscRule}`,
    "",
    'Example shape: {"name":"PricingCard","description":"Three-tier pricing.","code":"export interface PricingCardProps { title: string }\\nexport function PricingCard({ title }: PricingCardProps) { return <article>{title}</article> }"}',
  ].join("\n")
}

export function buildUserPrompt(input: { prompt: string; name?: string }): string {
  const nameLine = input.name
    ? `Use this exact component name: ${input.name}`
    : "Choose a clear PascalCase component name."
  return `${nameLine}\n\nRequest:\n${input.prompt.trim()}`
}

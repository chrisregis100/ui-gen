import { CodePreview } from "@/components/ui/code-preview"
import { CtaBanner } from "@/components/ui/cta-banner"
import { FeatureGrid } from "@/components/ui/feature-grid"
import { Footer } from "@/components/ui/footer"
import { Hero } from "@/components/ui/hero"
import { HowItWorks } from "@/components/ui/how-it-works"
import { Navbar } from "@/components/ui/navbar"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
]

export default function HomePage() {
  return (
    <>
      <Navbar links={navLinks} ctaHref="#get-started" />
      <main id="content" tabIndex={-1} className="focus:outline-none">
        <Hero installHref="#get-started" seeHowHref="#how-it-works" />
        <div id="features" className="scroll-mt-20">
          <FeatureGrid />
        </div>
        <HowItWorks id="how-it-works" className="scroll-mt-20" />
        <CodePreview />
        <div id="get-started" className="scroll-mt-20">
          <CtaBanner supportingText="ui-gen is MIT and maintained by Régis KIKI. The CLI and MCP server are free to run from this repository. Generate calls are billed by your model provider." />
        </div>
      </main>
      <Footer
        blurb="Generate a React, TypeScript, and Tailwind component and copy the file into your project."
        docsHref="#demo"
        cliHref="#how-it-works"
        mcpHref="#how-it-works"
        licenseHref="#get-started"
      />
    </>
  )
}

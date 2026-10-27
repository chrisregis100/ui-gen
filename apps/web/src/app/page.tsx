import { CodePreview } from "@/components/ui/code-preview"
import { CtaBanner } from "@/components/ui/cta-banner"
import { FeatureGrid } from "@/components/ui/feature-grid"
import { Footer } from "@/components/ui/footer"
import { Hero } from "@/components/ui/hero"
import { HowItWorks } from "@/components/ui/how-it-works"
import { Navbar } from "@/components/ui/navbar"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="content" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <FeatureGrid />
        <HowItWorks />
        <CodePreview />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}

import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const themeBootScript = `(function(){try{var stored=localStorage.getItem("theme");var prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;var isDark=stored?stored==="dark":prefersDark;document.documentElement.classList.toggle("dark",isDark);}catch(e){}})();`

export const metadata: Metadata = {
  title: "ui-gen — a prompt in, a component file out",
  description:
    "ui-gen generates a React, TypeScript, and Tailwind component from a prompt and writes it into your project. CLI and MCP server. Maintained by Régis KIKI.",
  applicationName: "ui-gen",
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-white font-sans text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}

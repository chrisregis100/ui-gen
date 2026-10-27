"use client"

import { Menu, Moon, Sun, X } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#demo", label: "Demo" },
  { href: "#open-source", label: "Open source" },
] as const

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export interface NavbarProps {
  brand?: string
  version?: string
}

export function Navbar({ brand = "ui-gen", version = "v0.1" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMenuOpen])

  const handleToggleMenu = () => setIsMenuOpen((open) => !open)

  const handleCloseMenu = () => setIsMenuOpen(false)

  const handleToggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", nextIsDark)
    localStorage.setItem("theme", nextIsDark ? "dark" : "light")
    setIsDark(nextIsDark)
  }

  const themeLabel = isDark ? "Switch to light theme" : "Switch to dark theme"

  return (
    <header id="top" className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className={cn("inline-flex items-baseline gap-2 rounded-full px-1", focusRing)}
          aria-label={`${brand} home`}
        >
          <span className="font-display text-2xl tracking-tight">{brand}</span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{version}</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                focusRing,
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted",
              focusRing,
            )}
            aria-pressed={isDark}
            aria-label={themeLabel}
            onClick={handleToggleTheme}
          >
            {isDark ? (
              <Sun aria-hidden="true" className="size-4" />
            ) : (
              <Moon aria-hidden="true" className="size-4" />
            )}
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted md:hidden",
              focusRing,
            )}
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
            onClick={handleToggleMenu}
          >
            {isMenuOpen ? (
              <X aria-hidden="true" className="size-4" />
            ) : (
              <Menu aria-hidden="true" className="size-4" />
            )}
            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      <nav
        id="site-menu"
        aria-label="Mobile"
        className={cn("border-t border-border px-4 py-3 md:hidden", !isMenuOpen && "hidden")}
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "flex h-11 items-center rounded-lg px-3 text-base hover:bg-muted",
                  focusRing,
                )}
                onClick={handleCloseMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

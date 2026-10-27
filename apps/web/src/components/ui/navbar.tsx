"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface NavbarProps {
  logoHref?: string
  ctaHref?: string
  links?: { label: string; href: string }[]
  className?: string
}

const defaultLinks: { label: string; href: string }[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
]

export function Navbar({
  logoHref = "/",
  ctaHref = "#get-started",
  links = defaultLinks,
  className,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setIsOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const handleToggle = () => setIsOpen((open) => !open)
  const handleClose = () => setIsOpen(false)

  return (
    <header id="top" className={cn("sticky top-0 z-40", className)}>
      <div className="border-b border-border bg-background/80 backdrop-blur-xl">
        <nav aria-label="Primary" className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <a href={logoHref} className="inline-flex items-center gap-2 rounded-md" aria-label="ui-gen home">
            <span aria-hidden="true" className="grid size-6 place-items-center rounded-md border border-border bg-card font-mono text-[10px] text-accent">
              ui
            </span>
            <span className="text-sm font-medium tracking-tight">ui-gen</span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Button href={ctaHref} className="h-9">
                Get started
              </Button>
            </div>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border md:hidden"
              aria-expanded={isOpen}
              aria-controls={menuId}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={handleToggle}
            >
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span className={cn("absolute inset-x-0 top-0 h-px bg-foreground transition-transform", isOpen && "top-1.5 rotate-45")} />
                <span className={cn("absolute inset-x-0 top-1.5 h-px bg-foreground transition-opacity", isOpen && "opacity-0")} />
                <span className={cn("absolute inset-x-0 top-3 h-px bg-foreground transition-transform", isOpen && "top-1.5 -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>
      </div>
      {isOpen ? (
        <div id={menuId} className="rise fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-background md:hidden">
          <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 py-8">
            <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Navigate</p>
            <ul className="mt-6 flex flex-col">
              {links.map((link) => (
                <li key={link.href} className="border-b border-border">
                  <a
                    href={link.href}
                    onClick={handleClose}
                    className="block py-5 font-display text-4xl tracking-tight"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button href={ctaHref} onClick={handleClose} className="mt-auto w-full">
              Get started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}

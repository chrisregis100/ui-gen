import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps {
  href: string
  children: ReactNode
  variant?: "primary" | "secondary"
  className?: string
  onClick?: () => void
}

export function Button({ href, children, variant = "primary", className, onClick }: ButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors duration-200",
        variant === "primary"
          ? "bg-accent text-accent-foreground hover:bg-accent/90"
          : "border border-border bg-white/[0.03] text-foreground hover:bg-white/[0.07]",
        className,
      )}
    >
      {children}
    </a>
  )
}

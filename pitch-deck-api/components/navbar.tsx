"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/pitch-decks", label: "Pitch Decks" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="size-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-lg font-bold text-foreground">
            Ascend
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/admin">Dashboard</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">Admin Login</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

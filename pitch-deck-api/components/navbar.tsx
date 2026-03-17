"use client"

import { useState, useRef } from "react"
import { useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/pitch-decks", label: "Pitch Decks" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#team", label: "Team" },
  { href: "/#contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, isAdmin, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => setMounted(true), [])

  // Close mobile menu when clicking or touching outside the menu
  useEffect(() => {
    function handleOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node
      if (!isOpen) return
      if (menuRef.current && menuRef.current.contains(target)) return
      if (toggleRef.current && toggleRef.current.contains(target)) return
      setIsOpen(false)
    }

    document.addEventListener("mousedown", handleOutside)
    document.addEventListener("touchstart", handleOutside)

    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
    }
  }, [isOpen])

  return (
    <nav className="fixed top-0 z-50 w-full bg-black/20 backdrop-blur-md border-b border-white/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-20">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
            <Image src="/logo.webp" alt="Ascend Finance & Advisory" width={72} height={72} />
            <div className="hidden sm:block">
              <p className="font-bold text-white text-2xl">Ascend</p>
              <p className="text-sm font-medium text-[#e9b449]">Finance & Advisory</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#e9b449] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/dashboard/admin" className="hidden md:block">
                    <button className="px-6 py-2 bg-gradient-to-r from-[#5b8ab5] to-[#e9b449] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#e9b449]/50 transition-all duration-300 transform hover:scale-105">
                      Dashboard
                    </button>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="hidden md:block px-6 py-2 border rounded-full font-semibold transition-all duration-300 text-center border-white/20 bg-white/5 hover:bg-white/10 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/signup" className="hidden md:block">
                  <button className="px-6 py-2 border rounded-full font-semibold transition-all duration-300 text-center border-white/20 bg-white/5 hover:bg-white/10 text-white">
                    Sign Up
                  </button>
                </Link>
                <Link href="/login" className="hidden md:block">
                  <button className="px-6 py-2 bg-gradient-to-r from-[#5b8ab5] to-[#e9b449] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#e9b449]/50 transition-all duration-300 transform hover:scale-105">
                    Login
                  </button>
                </Link>
              </>
            )}

            {/* Theme toggle */}
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-white/10 transition-colors text-white"
            >
              {mounted && (resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                ref={toggleRef}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-[#e9b449] transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-black/90 backdrop-blur-xl border-t border-white/10 mt-2 mx-[-1rem] px-4 pt-4"
          >
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  router.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="my-2 h-px border-t border-white/10" />
            
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/dashboard/admin"
                    className="block px-4 py-2 text-white hover:text-[#e9b449]"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="block px-4 py-2 text-white hover:text-[#e9b449]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:text-[#e9b449]"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:text-[#e9b449]"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

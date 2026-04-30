"use client"

import { useState, useRef } from "react"
import { useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, User as UserIcon, ChevronDown, LogOut } from "lucide-react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const publicLinks = [
  { href: "/pitch-decks", label: "Pitch Decks" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  // { href: "/#team", label: "Team" },
  { href: "/#contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)
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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node
      if (!profileOpen) return
      if (profileRef.current && profileRef.current.contains(target)) return
      setProfileOpen(false)
    }

    document.addEventListener("mousedown", handleOutside)
    document.addEventListener("touchstart", handleOutside)

    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
    }
  }, [profileOpen])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    setIsOpen(false)
  }

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

          <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-8">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#e9b449] transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            <Link href={user ? "/appointments" : "/login?redirect=/appointments"}>
              <button className="px-5 py-2 bg-gradient-to-r from-[#5b8ab5] to-[#e9b449] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#e9b449]/50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                Schedule Appointment
              </button>
            </Link>

            {user && isAdmin && (
              <Link href="/dashboard/admin">
                <button className="px-4 py-2 border rounded-full font-semibold transition-all duration-300 text-center border-white/20 bg-white/5 hover:bg-white/10 text-white whitespace-nowrap">
                  Dashboard
                </button>
              </Link>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4 md:gap-6">
            {user ? (
              <>
                {/* Profile Dropdown - Desktop */}
                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5b8ab5] to-[#e9b449] flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-white text-sm font-medium leading-tight max-w-[120px] truncate">
                        {user.name}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "w-3.5 h-3.5 text-white/60 transition-transform duration-200",
                      profileOpen && "rotate-180"
                    )} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:block">
                  <button className="px-6 py-2 border rounded-full font-semibold transition-all duration-300 text-center border-white/20 bg-white/5 hover:bg-white/10 text-white">
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
                  "block px-4 py-2 text-white hover:text-[#e9b449] transition-colors",
                  pathname === link.href
                    ? "text-[#e9b449]"
                    : "text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="my-2 h-px border-t border-white/10" />
            
            <Link
              href={user ? "/appointments" : "/login?redirect=/appointments"}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-[#e9b449] font-medium hover:text-white"
            >
              Schedule Appointment
            </Link>

            {user ? (
              <>
                {/* Mobile Profile Section */}
                <div className="mx-4 my-2 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5b8ab5] to-[#e9b449] flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-medium truncate">{user.name}</span>
                    <span className="text-white/50 text-xs truncate">{user.email}</span>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    href="/dashboard/admin"
                    className="block px-4 py-2 text-white hover:text-[#e9b449]"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:text-[#e9b449]"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

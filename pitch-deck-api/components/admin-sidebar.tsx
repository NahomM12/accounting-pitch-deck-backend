"use client"

import { useState, useRef } from "react"
import { useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Upload,
  BarChart3,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  CalendarClock,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    href: "/dashboard/admin/appointments",
    icon: CalendarClock,
  },
  {
    title: "Founders",
    href: "/dashboard/admin/founders",
    icon: Building2,
  },
  {
    title: "Pitch Decks",
    href: "/dashboard/admin/pitch-decks",
    icon: FileText,
  },
  {
    title: "Upload",
    href: "/dashboard/admin/pitch-decks/upload",
    icon: Upload,
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
    superadminOnly: true,
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout, isSuperAdmin } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col bg-black/20 backdrop-blur-md border-r border-white/10 transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
            <Image src="/logo.webp" alt="Ascend Finance & Advisory" width={48} height={48} />
            <div className="hidden sm:block">
              <p className="font-bold text-white text-lg">Ascend</p>
              <p className="text-xs font-medium text-[#e9b449]">Admin Panel</p>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-2 rounded-md hover:bg-white/10 transition-colors text-white",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col gap-1">
          {navItems
            .filter((item) => !item.superadminOnly || isSuperAdmin)
            .map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/admin" &&
                pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-[#5b8ab5] to-[#e9b449] text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="size-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && user && (
          <div className="mb-3 rounded-lg bg-white/5 p-2">
            <p className="truncate text-xs font-medium text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-white/70">
              {user.email}
            </p>
            <p className="mt-0.5 text-xs capitalize text-[#e9b449]">
              {user.role}
            </p>
          </div>
        )}
        <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "justify-between")}>
          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-white/10 transition-colors text-white"
          >
            {mounted && (resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-md hover:bg-white/10 transition-colors text-white"
            aria-label="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

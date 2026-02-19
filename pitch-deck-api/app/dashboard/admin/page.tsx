"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  FileText,
  Building2,
  Users,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { useAuth } from "@/lib/auth-context"
import { getPitchDecks, getFounders } from "@/lib/api"
import type { PitchDeck, Founder } from "@/lib/types"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [decks, setDecks] = useState<PitchDeck[]>([])
  const [founders, setFounders] = useState<Founder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [d, f] = await Promise.all([getPitchDecks(), getFounders()])
        setDecks(d)
        setFounders(f)
      } catch {
        // API may not be available
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const publishedDecks = decks.filter((d) => d.status === "published")
  const draftDecks = decks.filter((d) => d.status === "draft")

  const stats = [
    {
      title: "Total Pitch Decks",
      value: decks.length,
      icon: FileText,
      change: "+12%",
      href: "/dashboard/admin/pitch-decks",
    },
    {
      title: "Published",
      value: publishedDecks.length,
      icon: TrendingUp,
      change: "+8%",
      href: "/dashboard/admin/pitch-decks",
    },
    {
      title: "Founders",
      value: founders.length,
      icon: Building2,
      change: "+5%",
      href: "/dashboard/admin/founders",
    },
    {
      title: "Draft Decks",
      value: draftDecks.length,
      icon: FileText,
      change: "",
      href: "/dashboard/admin/pitch-decks",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-foreground">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {"Here's an overview of your platform."}
          </p>
        </div>
        <Button asChild className="mt-4 font-serif font-semibold md:mt-0">
          <Link href="/dashboard/admin/pitch-decks/upload">
            <Plus className="mr-1 size-4" />
            Upload Pitch Deck
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-all hover:shadow-md hover:border-primary/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="font-serif text-3xl font-extrabold text-foreground">
                    {stat.value}
                  </span>
                  {stat.change && (
                    <span className="mb-1 flex items-center text-xs text-emerald-600">
                      <ArrowUpRight className="size-3" />
                      {stat.change}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Recent Pitch Decks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-base font-bold">
              Recent Pitch Decks
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/admin/pitch-decks">
                View All
                <ArrowUpRight className="ml-1 size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {decks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pitch decks yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {decks.slice(0, 5).map((deck) => (
                  <div
                    key={deck.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {deck.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {deck.founder?.company_name || "Unknown founder"}
                      </p>
                    </div>
                    <StatusBadge status={deck.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Founders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-base font-bold">
              Recent Founders
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/admin/founders">
                View All
                <ArrowUpRight className="ml-1 size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {founders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No founders yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {founders.slice(0, 5).map((founder) => (
                  <div
                    key={founder.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {founder.company_name}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {founder.sector} &middot; {founder.location}
                      </p>
                    </div>
                    <Users className="size-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

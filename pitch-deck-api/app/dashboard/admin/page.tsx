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
  Activity,
  Download,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { useAuth } from "@/lib/auth-context"
import { getPitchDecks, getFounders, getAdminActivities, getDownloadLogs } from "@/lib/api"
import type { PitchDeck, Founder, AdminActivity, PitchDeckDownloadLog } from "@/lib/types"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [decks, setDecks] = useState<PitchDeck[]>([])
  const [founders, setFounders] = useState<Founder[]>([])
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [downloads, setDownloads] = useState<PitchDeckDownloadLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [d, f, a, dl] = await Promise.all([
          getPitchDecks(),
          getFounders(),
          getAdminActivities(),
          getDownloadLogs(),
        ])
        setDecks(d)
        setFounders(f)
        setActivities(a)
        setDownloads(dl)
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

      {/* Recent Activity & Downloads */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-base font-bold">
              Recent Admin Activity
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="size-4" />
              <span>Last {activities.length} actions</span>
            </div>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No admin activity recorded yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {activities.map((activity) => {
                  const title =
                    (activity.data &&
                      typeof activity.data === "object" &&
                      "title" in activity.data &&
                      typeof activity.data.title === "string" &&
                      activity.data.title) ||
                    undefined

                  let description = ""
                  if (activity.action === "add_or_replace_pitchdeck") {
                    description = title
                      ? `Created or replaced pitch deck "${title}"`
                      : "Created or replaced a pitch deck"
                  } else if (activity.action === "replace_pitchdeck_file") {
                    description = title
                      ? `Replaced file for pitch deck "${title}"`
                      : "Replaced pitch deck file"
                  } else if (activity.action === "edit_pitchdeck") {
                    const status =
                      activity.data &&
                      typeof activity.data === "object" &&
                      "status" in activity.data &&
                      typeof activity.data.status === "string"
                        ? activity.data.status
                        : undefined
                    if (title && status) {
                      description = `Edited pitch deck "${title}" (status: ${status})`
                    } else if (title) {
                      description = `Edited pitch deck "${title}"`
                    } else {
                      description = "Edited a pitch deck"
                    }
                  } else if (activity.action === "change_status") {
                    const oldStatus =
                      activity.data &&
                      typeof activity.data === "object" &&
                      "old_status" in activity.data &&
                      typeof activity.data.old_status === "string"
                        ? activity.data.old_status
                        : undefined
                    const newStatus =
                      activity.data &&
                      typeof activity.data === "object" &&
                      "new_status" in activity.data &&
                      typeof activity.data.new_status === "string"
                        ? activity.data.new_status
                        : undefined
                    if (title && oldStatus && newStatus) {
                      description = `Changed status of "${title}" from ${oldStatus} to ${newStatus}`
                    } else if (oldStatus && newStatus) {
                      description = `Changed pitch deck status from ${oldStatus} to ${newStatus}`
                    } else {
                      description = "Changed pitch deck status"
                    }
                  } else if (activity.action === "delete_pitchdeck") {
                    description = title
                      ? `Deleted pitch deck "${title}"`
                      : "Deleted a pitch deck"
                  } else if (activity.action === "create_founder") {
                    const company =
                      activity.data &&
                      typeof activity.data === "object" &&
                      "company_name" in activity.data &&
                      typeof activity.data.company_name === "string"
                        ? activity.data.company_name
                        : undefined
                    description = company
                      ? `Created founder "${company}"`
                      : "Created a founder"
                  } else if (activity.action === "update_founder") {
                    description = "Updated founder details"
                  } else if (activity.action === "delete_founder") {
                    const company =
                      activity.data &&
                      typeof activity.data === "object" &&
                      "company_name" in activity.data &&
                      typeof activity.data.company_name === "string"
                        ? activity.data.company_name
                        : undefined
                    description = company
                      ? `Deleted founder "${company}"`
                      : "Deleted a founder"
                  } else {
                    description = activity.subject_type && activity.subject_id
                      ? `${activity.subject_type} #${activity.subject_id}`
                      : "General action"
                  }

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {activity.admin_user?.name || "Unknown user"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {description}
                        </p>
                      </div>
                      <div className="ml-4 text-right text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-base font-bold">
              Recent Pitch Deck Downloads
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Download className="size-4" />
              <span>Last {downloads.length} downloads</span>
            </div>
          </CardHeader>
          <CardContent>
            {downloads.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No downloads recorded yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {downloads.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {log.pitch_deck?.title || `Pitch deck #${log.pitch_deck_id}`}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Downloaded by{" "}
                        {log.user?.email || `User #${log.user_id}`}
                      </p>
                    </div>
                    <div className="ml-4 text-right text-xs text-muted-foreground">
                      {new Date(log.downloaded_at).toLocaleString()}
                    </div>
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

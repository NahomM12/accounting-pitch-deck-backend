"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Activity, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AdminActivity } from "@/lib/types"
import { getAdminActivities } from "@/lib/api"

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await getAdminActivities()
        setActivities(data)
      } catch {
        setActivities([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/admin">
              <ArrowLeft className="mr-1 size-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-extrabold text-foreground">
              Admin Activity
            </h1>
            <p className="text-sm text-muted-foreground">
              Full history of actions performed by admins and superadmins.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-base font-bold">
            Activity Log
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="size-4" />
            <span>{activities.length} total</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading activity…</p>
          ) : activities.length === 0 ? (
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
                  description =
                    activity.subject_type && activity.subject_id
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
    </div>
  )
}


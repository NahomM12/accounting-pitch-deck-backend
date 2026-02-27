"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PitchDeckDownloadLog } from "@/lib/types"
import { getDownloadLogs } from "@/lib/api"

export default function AdminDownloadsPage() {
  const [logs, setLogs] = useState<PitchDeckDownloadLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await getDownloadLogs()
        setLogs(data)
      } catch {
        setLogs([])
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
              Pitch Deck Downloads
            </h1>
            <p className="text-sm text-muted-foreground">
              Full history of investor pitch deck download events.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-base font-bold">
            Download Log
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Download className="size-4" />
            <span>{logs.length} total</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading downloads…</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No downloads recorded yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {log.pitch_deck?.title || `Pitch deck #${log.pitch_deck_id}`}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Downloaded by {log.user?.email || `User #${log.user_id}`}
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
  )
}


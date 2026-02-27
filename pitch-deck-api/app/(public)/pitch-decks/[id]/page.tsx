"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  FileText,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Building2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { useRouter } from "next/navigation"
import { getPublicPitchDeck, downloadPitchDeck } from "@/lib/api"
import type { PitchDeck } from "@/lib/types"
import { toast } from "sonner"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://accounting-pitch-deck-.test"

export default function PitchDeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [deck, setDeck] = useState<PitchDeck | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchDeck() {
      try {
        const data = await getPublicPitchDeck(Number(id))
        setDeck(data)
      } catch {
        setDeck(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDeck()
  }, [id])

  async function handleDownload() {
    if (!deck) return
    setDownloading(true)
    try {
      const blob = await downloadPitchDeck(deck.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${deck.title}.${deck.file_type}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Download started!")
    } catch (err) {
      const error = err as Error & { data?: { message?: string; error?: string } }
      const message = error?.data?.message || error?.data?.error || error.message
      if (message === "Unauthorized" || message === "Unauthenticated.") {
        toast.error("Please log in as an investor to download this pitch deck.")
        router.push(`/login?redirect=/pitch-decks/${deck.id}`)
      } else {
        toast.error("Download failed. Please try again later.")
      }
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <FileText className="mb-4 size-12 text-muted-foreground/40" />
        <h2 className="font-serif text-xl font-bold text-foreground">
          Pitch Deck Not Found
        </h2>
        <p className="mt-2 text-muted-foreground">
          This pitch deck may have been removed or is not yet published.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/pitch-decks">
            <ArrowLeft className="mr-1 size-4" />
            Back to Pitch Decks
          </Link>
        </Button>
      </div>
    )
  }

  const thumbnailUrl = deck.thumbnail_path
    ? `${API_BASE}/storage/${deck.thumbnail_path}`
    : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/pitch-decks">
          <ArrowLeft className="mr-1 size-4" />
          Back to Pitch Decks
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Thumbnail */}
          <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={`${deck.title} preview`}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <FileText className="size-16 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Title & Meta */}
          <div className="mt-6">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="font-serif text-2xl font-extrabold text-foreground md:text-3xl text-balance">
                {deck.title}
              </h1>
              <StatusBadge status={deck.status} />
              <Badge variant="secondary" className="uppercase">
                {deck.file_type}
              </Badge>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              Uploaded on{" "}
              {new Date(deck.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Founder Info */}
          {deck.founder && (
            <div className="mt-8 rounded-xl border bg-card p-6">
              <h2 className="font-serif text-lg font-bold text-card-foreground">
                About the Founder
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={Building2}
                  label="Company"
                  value={deck.founder.company_name}
                />
                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={deck.founder.location}
                  capitalize
                />
                <InfoItem
                  icon={FileText}
                  label="Sector"
                  value={deck.founder.sector}
                  capitalize
                />
                <InfoItem
                  icon={DollarSign}
                  label="Funding Stage"
                  value={deck.founder.funding_stage}
                  capitalize
                />
                <InfoItem
                  icon={Users}
                  label="Employees"
                  value={deck.founder.number_of_employees}
                />
                <InfoItem
                  icon={DollarSign}
                  label="Funding Amount"
                  value={`$${Number(deck.founder.funding_amount).toLocaleString()}`}
                />
                <InfoItem
                  icon={Calendar}
                  label="Established"
                  value={String(deck.founder.years_of_establishment)}
                />
                <InfoItem
                  icon={DollarSign}
                  label="Valuation"
                  value={deck.founder.valuation}
                  capitalize
                />
              </div>
              {deck.founder.description && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {deck.founder.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-20 rounded-xl border bg-card p-6">
            <h3 className="font-serif font-bold text-card-foreground">
              Download Pitch Deck
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get the full pitch deck in {deck.file_type.toUpperCase()} format
              for offline review.
            </p>
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-4 w-full font-serif font-semibold"
              size="lg"
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-1 size-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-1 size-4" />
                  Download {deck.file_type.toUpperCase()}
                </>
              )}
            </Button>

            <div className="mt-6 flex flex-col gap-3 border-t pt-4">
              <DetailRow label="Format" value={deck.file_type.toUpperCase()} />
              <DetailRow label="Status" value={deck.status} />
              <DetailRow
                label="Uploaded"
                value={new Date(deck.created_at).toLocaleDateString()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  capitalize?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-sm font-medium text-foreground ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize text-foreground">{value}</span>
    </div>
  )
}

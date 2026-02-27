"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getPitchDeck, updatePitchDeck, updatePitchDeckFile, getApiOrigin } from "@/lib/api"
import { PITCH_DECK_STATUSES } from "@/lib/types"
import type { PitchDeck } from "@/lib/types"
import { toast } from "sonner"

export default function EditPitchDeckPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [deck, setDeck] = useState<PitchDeck | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReplacingFile, setIsReplacingFile] = useState(false)
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("")
  const [newFile, setNewFile] = useState<File | null>(null)
  const fileUrl = deck?.file_path ? `${getApiOrigin()}/storage/${deck.file_path}` : null

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getPitchDeck(Number(id))
        setDeck(data)
        setTitle(data.title)
        setStatus(data.status)
      } catch {
        setDeck(null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updatePitchDeck(Number(id), { title, status })
      toast.success("Pitch deck updated successfully!")
      router.push("/dashboard/admin/pitch-decks")
    } catch {
      toast.error("Failed to update pitch deck")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleFileReplace() {
    if (!deck) return
    if (!newFile) {
      toast.error("Please select a file to upload")
      return
    }
    setIsReplacingFile(true)

    try {
      const data = new FormData()
      data.append("file", newFile)

      const result = await updatePitchDeckFile(deck.id, data)

      setDeck((prev) =>
        prev
          ? {
              ...prev,
              file_path: result.pitch_deck.file_path,
              file_type: result.pitch_deck.file_type,
              status: result.pitch_deck.status,
            }
          : prev
      )
      setNewFile(null)
      toast.success("Pitch deck file replaced successfully!")
    } catch (err) {
      const error = err as Error & { data?: { errors?: Record<string, string[]> } }
      if (error.data?.errors) {
        const msgs = Object.values(error.data.errors).flat()
        toast.error(msgs[0] || "Validation failed")
      } else {
        toast.error("Failed to replace pitch deck file")
      }
    } finally {
      setIsReplacingFile(false)
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
        <h2 className="font-serif text-xl font-bold text-foreground">
          Pitch Deck Not Found
        </h2>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/admin/pitch-decks">Back to Pitch Decks</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard/admin/pitch-decks">
          <ArrowLeft className="mr-1 size-4" />
          Back to Pitch Decks
        </Link>
      </Button>

      <h1 className="font-serif text-2xl font-extrabold text-foreground">
        Edit Pitch Deck
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update details for &ldquo;{deck.title}&rdquo;
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-xl rounded-xl border bg-card p-6"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PITCH_DECK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className="capitalize">{s}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="text-muted-foreground">
              <strong className="text-foreground">File type:</strong>{" "}
              {deck.file_type.toUpperCase()}
            </p>
            <p className="mt-1 text-muted-foreground">
              <strong className="text-foreground">Founder:</strong>{" "}
              {deck.founder?.company_name || "Unknown"}
            </p>
          </div>
          {fileUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open(fileUrl, "_blank")}
              className="font-serif font-semibold"
            >
              Preview file ({deck.file_type.toUpperCase()})
            </Button>
          )}
          {/* <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">
              Replace pitch deck file
            </p>
            <div className="flex flex-col gap-2">
              <Label>New file (PDF, PPT, PPTX, max 20MB)</Label>
              {newFile ? (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                  <FileText className="size-5 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {newFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(newFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setNewFile(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50 hover:bg-muted/50">
                  <Upload className="size-6 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, PPT, or PPTX (max 20MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    className="sr-only"
                    onChange={(e) =>
                      setNewFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)
                    }
                  />
                </label>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={isReplacingFile || !newFile}
              onClick={handleFileReplace}
              className="font-serif font-semibold"
            >
              {isReplacingFile ? "Replacing..." : "Replace File"}
            </Button>
          </div> */}
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="font-serif font-semibold"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, FileText, X, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createFounder, createPitchDeck, getFounders, uploadThumbnail } from "@/lib/api"
import { LOCATIONS, FUNDING_STAGES, EMPLOYEE_RANGES } from "@/lib/types"
import type { Founder } from "@/lib/types"
import { toast } from "sonner"

export default function UploadPitchDeckPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [founders, setFounders] = useState<Founder[]>([])
  const [selectedFounderId, setSelectedFounderId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [founderMode, setFounderMode] = useState<"new" | "existing">("new")

  useEffect(() => {
    async function fetchFounders() {
      try {
        const data = await getFounders()
        setFounders(data)
      } catch {
        // API may not be available
      }
    }
    fetchFounders()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) {
      toast.error("Please select a pitch deck file")
      return
    }
    setIsSubmitting(true)

    try {
      const form = e.currentTarget
      const formData = new FormData()

      if (founderMode === "new") {
        // Create founder + pitch deck together
        formData.append("company_name", (form.elements.namedItem("company_name") as HTMLInputElement).value)
        formData.append("sector", (form.elements.namedItem("sector") as HTMLInputElement).value)
        formData.append("location", (form.elements.namedItem("location") as HTMLInputElement)?.value || "")
        formData.append("funding_stage", (form.elements.namedItem("funding_stage") as HTMLInputElement)?.value || "")
        formData.append("valuation", (form.elements.namedItem("valuation") as HTMLInputElement)?.value || "")
        formData.append("number_of_employees", (form.elements.namedItem("number_of_employees") as HTMLInputElement)?.value || "")
        formData.append("years_of_establishment", (form.elements.namedItem("years_of_establishment") as HTMLInputElement).value)
        formData.append("funding_amount", (form.elements.namedItem("funding_amount") as HTMLInputElement).value)
        formData.append("description", (form.elements.namedItem("description") as HTMLTextAreaElement).value)
        formData.append("pitch_deck_title", (form.elements.namedItem("pitch_deck_title") as HTMLInputElement).value)
        formData.append("file", file)

        const result = await createFounder(formData)

        // Upload thumbnail if provided
        if (thumbnail && result.pitch_deck?.id) {
          const thumbData = new FormData()
          thumbData.append("thumbnail", thumbnail)
          await uploadThumbnail(result.pitch_deck.id, thumbData)
        }
      } else {
        // Upload pitch deck for existing founder
        formData.append("title", (form.elements.namedItem("pitch_deck_title") as HTMLInputElement).value)
        formData.append("founder_id", selectedFounderId)
        formData.append("file", file)

        const result = await createPitchDeck(formData)

        // Upload thumbnail if provided
        if (thumbnail && result.pitch_deck?.id) {
          const thumbData = new FormData()
          thumbData.append("thumbnail", thumbnail)
          await uploadThumbnail(result.pitch_deck.id, thumbData)
        }
      }

      toast.success("Pitch deck uploaded successfully!")
      router.push("/dashboard/admin/pitch-decks")
    } catch (err) {
      const error = err as Error & { data?: { errors?: Record<string, string[]> } }
      if (error.data?.errors) {
        const msgs = Object.values(error.data.errors).flat()
        toast.error(msgs[0] || "Validation failed")
      } else {
        toast.error("Failed to upload pitch deck")
      }
    } finally {
      setIsSubmitting(false)
    }
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
        Upload Pitch Deck
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a new pitch deck with a new or existing founder profile.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
        <Tabs
          value={founderMode}
          onValueChange={(v) => setFounderMode(v as "new" | "existing")}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="new">
              <Building2 className="mr-1 size-4" />
              New Founder
            </TabsTrigger>
            <TabsTrigger value="existing">
              <Building2 className="mr-1 size-4" />
              Existing Founder
            </TabsTrigger>
          </TabsList>

          {/* New Founder Tab */}
          <TabsContent value="new">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-serif text-lg font-bold text-card-foreground">
                Founder Details
              </h2>
              <div className="mt-4 flex flex-col gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input id="company_name" name="company_name" required placeholder="Acme Corp" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Input id="sector" name="sector" required placeholder="Fintech" />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Location</Label>
                    <Select name="location" required>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((l) => (
                          <SelectItem key={l} value={l}><span className="capitalize">{l}</span></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Funding Stage</Label>
                    <Select name="funding_stage" required>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {FUNDING_STAGES.map((s) => (
                          <SelectItem key={s} value={s}><span className="capitalize">{s}</span></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Valuation Stage</Label>
                    <Select name="valuation" required>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {FUNDING_STAGES.map((s) => (
                          <SelectItem key={s} value={s}><span className="capitalize">{s}</span></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Employees</Label>
                    <Select name="number_of_employees" required>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {EMPLOYEE_RANGES.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="years_of_establishment">Year Established</Label>
                    <Input id="years_of_establishment" name="years_of_establishment" type="number" required placeholder="2020" min={1900} max={new Date().getFullYear()} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="funding_amount">Funding Amount ($)</Label>
                    <Input id="funding_amount" name="funding_amount" type="number" required placeholder="500000" min={0} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required rows={3} placeholder="Describe the company..." />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Existing Founder Tab */}
          <TabsContent value="existing">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-serif text-lg font-bold text-card-foreground">
                Select Founder
              </h2>
              <div className="mt-4">
                <Select value={selectedFounderId} onValueChange={setSelectedFounderId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a founder..." />
                  </SelectTrigger>
                  <SelectContent>
                    {founders.map((f) => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        {f.company_name} - {f.sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pitch Deck Details - Always shown */}
        <div className="mt-6 rounded-xl border bg-card p-6">
          <h2 className="font-serif text-lg font-bold text-card-foreground">
            Pitch Deck Details
          </h2>
          <div className="mt-4 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pitch_deck_title">Pitch Deck Title</Label>
              <Input
                id="pitch_deck_title"
                name="pitch_deck_title"
                required
                placeholder="Series A Pitch Deck"
              />
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-2">
              <Label>Pitch Deck File (PDF, PPT, PPTX, max 20MB)</Label>
              {file ? (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                  <FileText className="size-5 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/50">
                  <Upload className="size-8 text-muted-foreground" />
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
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="flex flex-col gap-2">
              <Label>Thumbnail Image (optional, converts to WebP)</Label>
              {thumbnail ? (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail preview"
                    className="size-12 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {thumbnail.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(thumbnail.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setThumbnail(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
                  <Upload className="size-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Upload thumbnail (JPEG, PNG, max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    className="sr-only"
                    onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="mt-6 w-full font-serif font-semibold"
        >
          {isSubmitting ? "Uploading..." : "Upload Pitch Deck"}
        </Button>
      </form>
    </div>
  )
}

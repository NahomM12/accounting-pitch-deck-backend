"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
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
import { createFounder } from "@/lib/api"
import { LOCATIONS, FUNDING_STAGES, EMPLOYEE_RANGES, VALUATION_STAGES } from "@/lib/types"
import { toast } from "sonner"

export default function CreateFounderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) {
      toast.error("Please select a pitch deck file")
      return
    }
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append("file", file)

    try {
      await createFounder(formData)
      toast.success("Founder created successfully!")
      router.push("/dashboard/admin/founders")
    } catch (err) {
      const error = err as Error & { data?: { errors?: Record<string, string[]> } }
      if (error.data?.errors) {
        const msgs = Object.values(error.data.errors).flat()
        toast.error(msgs[0] || "Validation failed")
      } else {
        toast.error("Failed to create founder")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard/admin/founders">
          <ArrowLeft className="mr-1 size-4" />
          Back to Founders
        </Link>
      </Button>

      <h1 className="font-serif text-2xl font-extrabold text-foreground">
        Create Founder Profile
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a new founder with their initial pitch deck.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-2xl rounded-xl border bg-card p-6"
      >
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                required
                placeholder="Acme Corp"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                name="sector"
                required
                placeholder="Fintech"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Select name="location" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      <span className="capitalize">{loc}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="funding_stage">Funding Stage</Label>
              <Select name="funding_stage" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {FUNDING_STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      <span className="capitalize">{stage}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="valuation">Valuation Stage</Label>
              <Select name="valuation" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select valuation" />
                </SelectTrigger>
                <SelectContent>
                  {VALUATION_STAGES.map((valuation) => (
                    <SelectItem key={valuation} value={valuation}>
                      <span className="capitalize">{valuation}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="number_of_employees">Number of Employees</Label>
              <Select name="number_of_employees" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="years_of_establishment">Year Established</Label>
              <Input
                id="years_of_establishment"
                name="years_of_establishment"
                type="number"
                required
                placeholder="2020"
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="funding_amount">Funding Amount ($)</Label>
              <Input
                id="funding_amount"
                name="funding_amount"
                type="number"
                required
                placeholder="500000"
                min={0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Describe the company and its vision..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="pitch_deck_title">Pitch Deck Title</Label>
            <Input
              id="pitch_deck_title"
              name="pitch_deck_title"
              required
              placeholder="Series A Pitch Deck"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Pitch Deck File (PDF, PPT, PPTX, max 20MB)</Label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
                <Upload className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {file ? file.name : "Choose a file..."}
                </span>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="font-serif font-semibold"
          >
            {isSubmitting ? "Creating..." : "Create Founder"}
          </Button>
        </div>
      </form>
    </div>
  )
}

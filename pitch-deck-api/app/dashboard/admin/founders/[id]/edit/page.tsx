"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { getFounder, updateFounder } from "@/lib/api"
import type { Founder } from "@/lib/types"
import {
  LOCATIONS,
  OPERATIONAL_STAGES,
  EMPLOYEE_RANGES,
  VALUATION_STAGES,
  FOUNDER_STATUSES,
  SECTORS,
} from "@/lib/types"
import { toast } from "sonner"

export default function EditFounderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [founder, setFounder] = useState<Founder | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [sector, setSector] = useState("")
  const [location, setLocation] = useState("")
  const [operationalStage, setOperationalStage] = useState("")
  const [investmentSize, setInvestmentSize] = useState("")
  const [numberOfEmployees, setNumberOfEmployees] = useState("")
  const [yearsOfEstablishment, setYearsOfEstablishment] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [valuation, setValuation] = useState("")

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getFounder(Number(id))
        setFounder(data)
        setCompanyName(data.company_name)
        setSector(data.sector ?? "")
        setLocation(data.location ?? "")
        setOperationalStage(data.operational_stage ?? "")
        setInvestmentSize(
          data.investment_size !== null && data.investment_size !== undefined
            ? String(data.investment_size)
            : ""
        )
        setNumberOfEmployees(data.number_of_employees ?? "")
        setYearsOfEstablishment(
          data.years_of_establishment
            ? String(data.years_of_establishment)
            : ""
        )
        setDescription(data.description ?? "")
        setStatus(data.status ?? "")
        setValuation(data.valuation ?? "")
      } catch {
        setFounder(null)
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
      await updateFounder(Number(id), {
        company_name: companyName,
        sector,
        location,
        operational_stage: operationalStage,
        investment_size: investmentSize || null,
        number_of_employees: numberOfEmployees,
        years_of_establishment: yearsOfEstablishment || null,
        description,
        valuation,
        status,
      })
      toast.success("Founder updated successfully!")
      router.push(`/dashboard/admin/founders/${id}`)
    } catch (err) {
      const error = err as Error & { data?: { errors?: Record<string, string[]> } }
      if (error.data?.errors) {
        const msgs = Object.values(error.data.errors).flat()
        toast.error(msgs[0] || "Validation failed")
      } else {
        toast.error("Failed to update founder")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!founder) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Founder Not Found
        </h2>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/admin/founders">Back to Founders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={`/dashboard/admin/founders/${id}`}>
          <ArrowLeft className="mr-1 size-4" />
          Back to Founder
        </Link>
      </Button>

      <h1 className="font-serif text-2xl font-extrabold text-foreground">
        Edit Founder
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update details for {founder.company_name}.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-xl rounded-xl border bg-card p-6"
      >
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sector">Sector</Label>
              <Select
                value={sector}
                onValueChange={setSector}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={location}
                onValueChange={setLocation}
              >
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
              <Label htmlFor="operational_stage">Operational Stage</Label>
              <Select
                value={operationalStage}
                onValueChange={setOperationalStage}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATIONAL_STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      <span className="capitalize">{stage.replace(/-/g, ' ')}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="valuation">Valuation Stage</Label>
              <Select
                value={valuation}
                onValueChange={setValuation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select valuation" />
                </SelectTrigger>
                <SelectContent>
                  {VALUATION_STAGES.map((v) => (
                    <SelectItem key={v} value={v}>
                      <span className="capitalize">{v}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="number_of_employees">Number of Employees</Label>
              <Select
                value={numberOfEmployees}
                onValueChange={setNumberOfEmployees}
              >
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
                type="number"
                value={yearsOfEstablishment}
                onChange={(e) => setYearsOfEstablishment(e.target.value)}
                placeholder="2020"
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="investment_size">Investment Size ($)</Label>
              <Input
                id="investment_size"
                type="number"
                value={investmentSize}
                onChange={(e) => setInvestmentSize(e.target.value)}
                placeholder="500000"
                min={0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the company and its vision..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {FOUNDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className="capitalize">{s}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

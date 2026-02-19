"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { getFounder } from "@/lib/api"
import type { Founder } from "@/lib/types"

export default function FounderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [founder, setFounder] = useState<Founder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getFounder(Number(id))
        setFounder(data)
      } catch {
        setFounder(null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

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
        <Building2 className="mb-4 size-12 text-muted-foreground/40" />
        <h2 className="font-serif text-xl font-bold text-foreground">
          Founder Not Found
        </h2>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/admin/founders">
            <ArrowLeft className="mr-1 size-4" />
            Back to Founders
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/admin/founders">
            <ArrowLeft className="mr-1 size-4" />
            Back to Founders
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/admin/founders/${id}/edit`}>
            <Pencil className="mr-1 size-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex items-start gap-3">
          <h1 className="font-serif text-2xl font-extrabold text-foreground">
            {founder.company_name}
          </h1>
          <StatusBadge status={founder.status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={MapPin}
            label="Location"
            value={founder.location}
            capitalize
          />
          <InfoCard
            icon={FileText}
            label="Sector"
            value={founder.sector}
            capitalize
          />
          <InfoCard
            icon={DollarSign}
            label="Funding Stage"
            value={founder.funding_stage}
            capitalize
          />
          <InfoCard
            icon={Users}
            label="Employees"
            value={founder.number_of_employees}
          />
          <InfoCard
            icon={DollarSign}
            label="Funding Amount"
            value={`$${Number(founder.funding_amount).toLocaleString()}`}
          />
          <InfoCard
            icon={DollarSign}
            label="Valuation"
            value={founder.valuation}
            capitalize
          />
          <InfoCard
            icon={Calendar}
            label="Established"
            value={String(founder.years_of_establishment)}
          />
          <InfoCard
            icon={Calendar}
            label="Created"
            value={new Date(founder.created_at).toLocaleDateString()}
          />
        </div>

        {founder.description && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-serif text-base font-bold">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {founder.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function InfoCard({
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
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p
            className={`text-sm font-semibold text-foreground ${capitalize ? "capitalize" : ""}`}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

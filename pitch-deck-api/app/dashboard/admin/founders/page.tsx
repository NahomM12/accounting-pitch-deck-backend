"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { StatusBadge } from "@/components/status-badge"
import { getFounders, deleteFounder } from "@/lib/api"
import type { Founder } from "@/lib/types"
import { toast } from "sonner"

export default function FoundersListPage() {
  const [founders, setFounders] = useState<Founder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchFounders = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getFounders({ search: searchQuery || undefined })
      setFounders(data)
    } catch {
      setFounders([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(fetchFounders, 300)
    return () => clearTimeout(timer)
  }, [fetchFounders])

  async function handleDelete(id: number) {
    try {
      await deleteFounder(id)
      setFounders((prev) => prev.filter((f) => f.id !== id))
      toast.success("Founder deleted successfully")
    } catch {
      toast.error("Failed to delete founder")
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-foreground">
            Founders
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all founder profiles on the platform.
          </p>
        </div>
        <Button asChild className="font-serif font-semibold">
          <Link href="/dashboard/admin/founders/create">
            <Plus className="mr-1 size-4" />
            Add Founder
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search founders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : founders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="mb-4 size-12 text-muted-foreground/40" />
            <h3 className="font-serif font-bold text-foreground">
              No founders found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a new founder profile to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {founders.map((founder) => (
                  <TableRow key={founder.id}>
                    <TableCell className="font-medium">
                      {founder.company_name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {founder.sector}
                    </TableCell>
                    <TableCell className="capitalize">
                      {founder.location}
                    </TableCell>
                    <TableCell className="capitalize">
                      {founder.funding_stage}
                    </TableCell>
                    <TableCell>{founder.number_of_employees}</TableCell>
                    <TableCell>
                      <StatusBadge status={founder.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link href={`/dashboard/admin/founders/${founder.id}`}>
                            <Eye className="size-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link
                            href={`/dashboard/admin/founders/${founder.id}/edit`}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Trash2 className="size-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Founder</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <strong>{founder.company_name}</strong>? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(founder.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

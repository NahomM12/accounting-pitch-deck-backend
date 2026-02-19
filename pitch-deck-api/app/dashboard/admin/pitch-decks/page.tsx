"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  Image as ImageIcon,
  ArrowUpDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"
import { getPitchDecks, deletePitchDeck, changePitchDeckStatus } from "@/lib/api"
import type { PitchDeck } from "@/lib/types"
import { PITCH_DECK_STATUSES } from "@/lib/types"
import { toast } from "sonner"

export default function PitchDecksManagePage() {
  const [decks, setDecks] = useState<PitchDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchDecks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPitchDecks()
      setDecks(data)
    } catch {
      setDecks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDecks()
  }, [fetchDecks])

  async function handleDelete(id: number) {
    try {
      await deletePitchDeck(id)
      setDecks((prev) => prev.filter((d) => d.id !== id))
      toast.success("Pitch deck deleted successfully")
    } catch {
      toast.error("Failed to delete pitch deck")
    }
  }

  async function handleStatusChange(id: number, status: string) {
    try {
      await changePitchDeckStatus(id, { status })
      setDecks((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: status as PitchDeck["status"] } : d))
      )
      toast.success(`Status updated to ${status}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const filteredDecks = decks.filter((deck) => {
    const matchesSearch =
      !searchQuery ||
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.founder?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || deck.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-foreground">
            Pitch Decks
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all pitch decks on the platform.
          </p>
        </div>
        <Button asChild className="font-serif font-semibold">
          <Link href="/dashboard/admin/pitch-decks/upload">
            <Plus className="mr-1 size-4" />
            Upload Pitch Deck
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pitch decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PITCH_DECK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                <span className="capitalize">{s}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 rounded-xl border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="mb-4 size-12 text-muted-foreground/40" />
            <h3 className="font-serif font-bold text-foreground">
              No pitch decks found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a pitch deck to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Founder</TableHead>
                  <TableHead>
                    <span className="flex items-center gap-1">
                      Type
                      <ArrowUpDown className="size-3" />
                    </span>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDecks.map((deck) => (
                  <TableRow key={deck.id}>
                    <TableCell className="max-w-48">
                      <p className="truncate font-medium">{deck.title}</p>
                    </TableCell>
                    <TableCell>
                      {deck.founder?.company_name || "Unknown"}
                    </TableCell>
                    <TableCell className="uppercase text-xs font-medium">
                      {deck.file_type}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={deck.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(deck.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link
                            href={`/dashboard/admin/pitch-decks/${deck.id}/edit`}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link
                            href={`/dashboard/admin/pitch-decks/${deck.id}/thumbnail`}
                          >
                            <ImageIcon className="size-4" />
                            <span className="sr-only">Thumbnail</span>
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
                              <AlertDialogTitle>
                                Delete Pitch Deck
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <strong>{deck.title}</strong>? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(deck.id)}
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

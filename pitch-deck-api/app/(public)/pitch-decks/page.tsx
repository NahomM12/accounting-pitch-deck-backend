"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, SlidersHorizontal, Grid3X3, List, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { PitchDeckCard } from "@/components/pitch-deck-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import { getPitchDecks } from "@/lib/api"
import type { PitchDeck, FounderFilters } from "@/lib/types"

const defaultFilters: FounderFilters = {
  search: "",
  sector: "",
  location: "",
  funding_stage: "",
  number_of_employees: "",
  min_funding_amount: "",
  max_funding_amount: "",
  sort_by: "created_at",
  sort_direction: "desc",
}

export default function PitchDecksPage() {
  const [decks, setDecks] = useState<PitchDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FounderFilters>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fetchDecks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPitchDecks()
      setDecks(data)
    } catch {
      // API may not be available, use empty array
      setDecks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDecks()
  }, [fetchDecks])

  // Client-side filtering since getPitchDecks doesn't support filters directly
  const filteredDecks = decks.filter((deck) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesTitle = deck.title.toLowerCase().includes(q)
      const matchesCompany = deck.founder?.company_name?.toLowerCase().includes(q)
      const matchesSector = deck.founder?.sector?.toLowerCase().includes(q)
      if (!matchesTitle && !matchesCompany && !matchesSector) return false
    }
    if (filters.location && deck.founder?.location !== filters.location) return false
    if (filters.funding_stage && deck.founder?.funding_stage !== filters.funding_stage) return false
    if (filters.sector && !deck.founder?.sector?.toLowerCase().includes(filters.sector.toLowerCase())) return false
    if (filters.number_of_employees && deck.founder?.number_of_employees !== filters.number_of_employees) return false
    return true
  })

  return (
    <div>
      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-serif text-3xl font-extrabold text-primary-foreground md:text-4xl text-balance">
            Browse Pitch Decks
          </h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">
            Explore curated pitch decks from innovative startups across Ethiopia.
          </p>
          <div className="mt-6 flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, company, sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 pl-9 text-primary-foreground placeholder:text-primary-foreground/50"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 rounded-xl border bg-card p-5">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(defaultFilters)}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading..." : `${filteredDecks.length} pitch decks found`}
              </p>
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="mr-1 size-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 px-1">
                      <FilterSidebar
                        filters={filters}
                        onChange={setFilters}
                        onReset={() => setFilters(defaultFilters)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon-sm"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="size-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon-sm"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <List className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : filteredDecks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="mb-4 size-12 text-muted-foreground/40" />
                <h3 className="font-serif text-lg font-bold text-foreground">
                  No pitch decks found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search query.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setFilters(defaultFilters)
                    setSearchQuery("")
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredDecks.map((deck) => (
                  <PitchDeckCard key={deck.id} deck={deck} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredDecks.map((deck) => (
                  <PitchDeckCard key={deck.id} deck={deck} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

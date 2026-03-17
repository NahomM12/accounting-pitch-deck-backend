"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, SlidersHorizontal, Grid3X3, List, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { PitchDeckCard } from "@/components/pitch-deck-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import { getPublicPitchDecks } from "@/lib/api"
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
      const data = await getPublicPitchDecks()
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
      <section className="relative overflow-hidden bg-[#0a0a0a]">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0a0a]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]/30" />
          
          {/* Additional Dark Overlay for text contrast */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Central Glow/Halo Layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            className="w-[800px] h-[800px] rounded-full blur-[140px] bg-[radial-gradient(circle,_rgba(233,180,73,0.4)_0%,_rgba(74,123,167,0.2)_40%,_transparent_70%)] opacity-80"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 relative z-20 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 w-full py-20">
            <div className="lg:w-[55%] text-center lg:text-left z-20 xl:pl-8">
              <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[1.1] text-white tracking-tight">
                Browse Pitch Decks
              </h1>
              <p className="text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 text-gray-300">
                Explore curated pitch decks from innovative startups across Ethiopia.
              </p>
            </div>

            <div className="hidden lg:flex lg:w-[45%] justify-center items-center z-10 relative">
              <div className="w-full max-w-[600px] h-auto flex items-center justify-center relative translate-x-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
                  <Input
                    placeholder="Search by title, company, sector..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 pl-9 text-white dark:text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
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

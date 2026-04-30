"use client"

import { RotateCcw } from "lucide-react"
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
import { Slider } from "@/components/ui/slider"
import type { FounderFilters } from "@/lib/types"
import { LOCATIONS, OPERATIONAL_STAGES, EMPLOYEE_RANGES, SECTORS } from "@/lib/types"

interface FilterSidebarProps {
  filters: FounderFilters
  onChange: (filters: FounderFilters) => void
  onReset: () => void
}

export function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  function updateFilter(key: keyof FounderFilters, value: string) {
    onChange({ ...filters, [key]: value === "all" ? "" : value })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="mr-1 size-3" />
          Reset
        </Button>
      </div>

      {/* Search */}
      {/* <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Search
        </Label>
        <Input
          placeholder="Search founders..."
          value={filters.search || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div> */}

      {/* Sector */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Sector
        </Label>
        <Select
          value={filters.sector || "all"}
          onValueChange={(v) => updateFilter("sector", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sectors</SelectItem>
            {SECTORS.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Location
        </Label>
        <Select
          value={filters.location || "all"}
          onValueChange={(v) => updateFilter("location", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {LOCATIONS.map((loc) => (
              <SelectItem key={loc} value={loc}>
                <span className="capitalize">{loc}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Operational Stage */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Operational Stage
        </Label>
        <Select
          value={filters.operational_stage || "all"}
          onValueChange={(v) => updateFilter("operational_stage", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {OPERATIONAL_STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>
                <span className="capitalize">{stage.replace(/-/g, ' ')}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employee Range */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Employees
        </Label>
        <Select
          value={filters.number_of_employees || "all"}
          onValueChange={(v) => updateFilter("number_of_employees", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any size</SelectItem>
            {EMPLOYEE_RANGES.map((range) => (
              <SelectItem key={range} value={range}>
                {range} employees
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Investment Size Range */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Investment Size
        </Label>
        <div className="px-1">
          <Slider
            min={0}
            max={10000000}
            step={100000}
            value={[
              Number(filters.min_investment_size) || 0,
              Number(filters.max_investment_size) || 10000000,
            ]}
            onValueChange={([min, max]) => {
              onChange({
                ...filters,
                min_investment_size: min > 0 ? String(min) : "",
                max_investment_size: max < 10000000 ? String(max) : "",
              })
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            ${((Number(filters.min_investment_size) || 0) / 1000000).toFixed(1)}M
          </span>
          <span>
            $
            {(
              (Number(filters.max_investment_size) || 10000000) / 1000000
            ).toFixed(1)}
            M
          </span>
        </div>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Sort By
        </Label>
        <Select
          value={filters.sort_by || "created_at"}
          onValueChange={(v) => updateFilter("sort_by", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Date Added</SelectItem>
            <SelectItem value="company_name">Company Name</SelectItem>
            <SelectItem value="investment_size">Investment Size</SelectItem>
            <SelectItem value="sector">Sector</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.sort_direction || "desc"}
          onValueChange={(v) => updateFilter("sort_direction", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

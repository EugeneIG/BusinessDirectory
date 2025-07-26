"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search: string
    category: string
    rating: string
    location: string
  }) => void
  totalResults: number
}

export function SearchFilters({ onFiltersChange, totalResults }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: "All Categories",
    rating: "Any Rating",
    location: "",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)

    // Update active filters
    const newActiveFilters = Object.entries(newFilters)
      .filter(([, v]) => v !== "" && v !== "All Categories" && v !== "Any Rating")
      .map(([k, v]) => `${k}: ${v}`)
    setActiveFilters(newActiveFilters)
  }

  const clearFilter = (filterToRemove: string) => {
    const [key] = filterToRemove.split(": ")
    handleFilterChange(key, "")
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "All Categories",
      rating: "Any Rating",
      location: "",
    }
    setFilters(clearedFilters)
    setActiveFilters([])
    onFiltersChange(clearedFilters)
  }

  return (
    <div className="bg-white border-b sticky top-16 z-40 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Input
              placeholder="Search businesses..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="max-w-xs"
            />

            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Hospital">Healthcare</SelectItem>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Services">Services</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any Rating">Any Rating</SelectItem>
                <SelectItem value="4+">4+ Stars</SelectItem>
                <SelectItem value="3+">3+ Stars</SelectItem>
                <SelectItem value="2+">2+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 whitespace-nowrap">{totalResults} results</span>
            {activeFilters.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter(filter)} />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  X,
  ChevronDown,
  DollarSign,
  Accessibility,
  CreditCard,
  Clock,
  Search,
  Star,
  SlidersHorizontal,
  Filter,
  Users,
} from "lucide-react"


interface Category {
  category_id: string
  name: string
  url: string
  count: number
}

interface ServiceOption {
  option_id: string
  name: string
  slug: string
  business_count: number
  category_name: string
  category_slug: string
}

interface AdvancedSearchFiltersProps {
  onFiltersChange: (filters: {
    search: string
    category: string
    rating: string
    priceRange: string[]
    amenities: string[]
    accessibility: string[]
    paymentMethods: string[]
    serviceOptions: string[]
  }) => void
  totalResults: number
  initialFilters?: {
    search?: string
    category?: string
    rating?: string
  }
}

export function AdvancedSearchFilters({ onFiltersChange, totalResults, initialFilters }: AdvancedSearchFiltersProps) {
  const [filters, setFilters] = useState({
    search: initialFilters?.search || "",
    category: initialFilters?.category || "All Categories",
    rating: initialFilters?.rating || "Any Rating",
    priceRange: [] as string[],
    amenities: [] as string[],
    accessibility: [] as string[],
    paymentMethods: [] as string[],
    serviceOptions: [] as string[],
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [availableServiceOptions, setAvailableServiceOptions] = useState<ServiceOption[]>([])
  const [serviceOptionsLoading, setServiceOptionsLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/all')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Fetch service options
  useEffect(() => {
    const fetchServiceOptions = async () => {
      try {
        const response = await fetch('/api/service-options')
        const data = await response.json()
        setAvailableServiceOptions(data.options || [])
      } catch (error) {
        console.error('Error fetching service options:', error)
      } finally {
        setServiceOptionsLoading(false)
      }
    }
    fetchServiceOptions()
  }, [])



  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
    updateActiveFilters(newFilters)
  }

  const handleArrayFilterChange = (key: string, value: string, checked: boolean) => {
    const currentArray = filters[key as keyof typeof filters] as string[]
    const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value)
    handleFilterChange(key, newArray)
  }

  const updateActiveFilters = (newFilters: typeof filters) => {
    const active: string[] = []
    if (newFilters.search) active.push(`Search: ${newFilters.search}`)
    if (newFilters.category !== "All Categories") active.push(`Category: ${newFilters.category}`)
    if (newFilters.rating !== "Any Rating") active.push(`Rating: ${newFilters.rating}`)
    if (newFilters.priceRange.length > 0) active.push(`Price: ${newFilters.priceRange.join(", ")}`)
    if (newFilters.amenities.length > 0) active.push(`Amenities: ${newFilters.amenities.length} selected`)
    if (newFilters.accessibility.length > 0) active.push(`Accessibility: ${newFilters.accessibility.length} selected`)
    if (newFilters.paymentMethods.length > 0) active.push(`Payment: ${newFilters.paymentMethods.length} selected`)
    if (newFilters.serviceOptions.length > 0) {
      const serviceNames = newFilters.serviceOptions.map(slug => {
        const option = availableServiceOptions.find(opt => opt.slug === slug)
        return option ? option.name : slug
      })
      active.push(`Services: ${serviceNames.join(", ")}`)
    }
    setActiveFilters(active)
  }

  const clearFilter = (filterToRemove: string) => {
    const [key] = filterToRemove.split(": ")
    if (key === "Search") handleFilterChange("search", "")
    else if (key === "Category") handleFilterChange("category", "All Categories")
    else if (key === "Rating") handleFilterChange("rating", "Any Rating")
    else if (key === "Price") handleFilterChange("priceRange", [])
    else if (key === "Amenities") handleFilterChange("amenities", [])
    else if (key === "Accessibility") handleFilterChange("accessibility", [])
    else if (key === "Payment") handleFilterChange("paymentMethods", [])
    else if (key === "Services") {
      // Clear all service options
      handleFilterChange("serviceOptions", [])
    }
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "All Categories",
      rating: "Any Rating",
      priceRange: [],
      amenities: [],
      accessibility: [],
      paymentMethods: [],
      serviceOptions: [],
    }
    setFilters(clearedFilters)
    setActiveFilters([])
    onFiltersChange(clearedFilters)
  }

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Search className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Search</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search businesses..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-12 bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 h-12 text-base"
          />
        </div>
      </div>

      {/* Basic Filters */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Basic Filters</h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Category</label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger className="bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 h-12 text-base">
                <SelectValue placeholder={categoriesLoading ? "Loading..." : "All Categories"} />
              </SelectTrigger>
              <SelectContent className="border border-gray-200 rounded-2xl bg-white">
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.category_id} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Rating</label>
            <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
              <SelectTrigger className="bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 h-12 text-base">
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent className="border border-gray-200 rounded-2xl bg-white">
                <SelectItem value="Any Rating">Any Rating</SelectItem>
                <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                <SelectItem value="4+">4+ Stars</SelectItem>
                <SelectItem value="3.5+">3.5+ Stars</SelectItem>
                <SelectItem value="3+">3+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>



      {/* Price Range Filter */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Price Range</h3>
        </div>
        <div className="space-y-4">
          {["$", "$$", "$$$", "$$$$"].map((price) => (
            <div key={price} className="flex items-center space-x-4">
              <Checkbox
                id={`price-${price}`}
                checked={filters.priceRange.includes(price)}
                onCheckedChange={(checked) => handleArrayFilterChange("priceRange", price, checked as boolean)}
                className="rounded-lg"
              />
              <label htmlFor={`price-${price}`} className="text-base font-medium text-gray-700 cursor-pointer flex-1">
                {price} {price === "$" && "(Budget)"}
                {price === "$$" && "(Moderate)"}
                {price === "$$$" && "(Expensive)"}
                {price === "$$$$" && "(Very Expensive)"}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Amenities</h3>
        </div>
        <div className="space-y-4">
          {["WiFi", "Parking", "Delivery", "Takeout", "Dine-in", "Outdoor Seating", "Wheelchair Accessible"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-4">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={(checked) => handleArrayFilterChange("amenities", amenity, checked as boolean)}
                className="rounded-lg"
              />
              <label htmlFor={`amenity-${amenity}`} className="text-base font-medium text-gray-700 cursor-pointer flex-1">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Filter */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Accessibility className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Accessibility</h3>
        </div>
        <div className="space-y-4">
          {["Wheelchair Accessible", "Accessible Parking", "Accessible Restrooms", "Assistive Technology", "Service Animals Welcome"].map((accessibility) => (
            <div key={accessibility} className="flex items-center space-x-4">
              <Checkbox
                id={`accessibility-${accessibility}`}
                checked={filters.accessibility.includes(accessibility)}
                onCheckedChange={(checked) => handleArrayFilterChange("accessibility", accessibility, checked as boolean)}
                className="rounded-lg"
              />
              <label htmlFor={`accessibility-${accessibility}`} className="text-base font-medium text-gray-700 cursor-pointer flex-1">
                {accessibility}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods Filter */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>
        </div>
        <div className="space-y-4">
          {["Cash", "Credit Card", "Debit Card", "Digital Wallet", "Contactless Payment", "Online Payment"].map((payment) => (
            <div key={payment} className="flex items-center space-x-4">
              <Checkbox
                id={`payment-${payment}`}
                checked={filters.paymentMethods.includes(payment)}
                onCheckedChange={(checked) => handleArrayFilterChange("paymentMethods", payment, checked as boolean)}
                className="rounded-lg"
              />
              <label htmlFor={`payment-${payment}`} className="text-base font-medium text-gray-700 cursor-pointer flex-1">
                {payment}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Service Options Filter */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Star className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Service Options</h3>
        </div>
        <div className="space-y-4">
          {serviceOptionsLoading ? (
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="text-base">Loading service options...</span>
            </div>
          ) : (
            availableServiceOptions.slice(0, 10).map((option) => (
              <div key={option.option_id} className="flex items-center space-x-4">
                <Checkbox
                  id={`service-${option.option_id}`}
                  checked={filters.serviceOptions.includes(option.slug)}
                  onCheckedChange={(checked) => {
                    handleArrayFilterChange("serviceOptions", option.slug, checked as boolean)
                  }}
                  className="rounded-lg"
                />
                <label htmlFor={`service-${option.option_id}`} className="text-base font-medium text-gray-700 cursor-pointer flex-1">
                  {option.name} ({option.business_count})
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-8 border-t border-gray-200">
        <Button
          onClick={clearAllFilters}
          className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl font-semibold transition-all duration-300 h-12 text-base"
        >
          Clear All
        </Button>
        <Button
          onClick={() => {
            setIsDesktopFiltersOpen(false)
            setIsMobileFiltersOpen(false)
          }}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-2xl font-semibold transition-all duration-300 h-12 text-base shadow-lg hover:shadow-xl"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200/50 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search businesses..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-12 bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 h-12 text-base shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {/* Desktop: Side Panel */}
            <div className="hidden xl:block">
              <Sheet open={isDesktopFiltersOpen} onOpenChange={setIsDesktopFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-2xl px-6 py-3 transition-all duration-300 flex items-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span className="font-semibold">Filters</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDesktopFiltersOpen ? "rotate-180" : ""}`} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-96 p-8 overflow-y-auto bg-white">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Filter className="h-5 w-5 text-white" />
                      </div>
                      Advanced Filters
                    </SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Mobile: Full Screen */}
            <div className="xl:hidden">
              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-2xl px-6 py-3 transition-all duration-300 flex items-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span className="font-semibold">Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh] p-0 bg-white">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <Filter className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="rounded-2xl"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      <FilterContent />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Counter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-sm">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">{totalResults.toLocaleString()} results</span>
              </div>
              {activeFilters.length > 0 && (
                <Button 
                  onClick={clearAllFilters}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Modern Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-6">
            {activeFilters.map((filter) => (
              <Badge 
                key={filter} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 shadow-md"
              >
                {filter}
                <X
                  className="h-4 w-4 cursor-pointer hover:text-white/80 transition-colors"
                  onClick={() => clearFilter(filter)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

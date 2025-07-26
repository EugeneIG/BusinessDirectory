"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BusinessGrid } from "@/components/business-grid"
import { AdvancedSearchFilters } from "@/components/advanced-search-filters"
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Filter, Search, Star, Building2, TrendingUp, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Business {
  title: string
  url: string
  place_id: string
  rating: number
  reviews: number
  type: string
  types: string[]
  address: string
  open_state: string
  phone: string | undefined
  website: string | undefined
  thumbnail: string
  city: string
  country: string
  category: string
  price: string | undefined
  gps_coordinates?: {
    latitude: number
    longitude: number
  }
  service_option: Array<{
    name: string
    slug: string
    options: Array<{
      name: string
      slug: string
    }>
  }>
  distance?: number
}

export default function BusinessesPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  
  // Get initial values from URL parameters
  const initialCategory = searchParams.get("category") || "All Categories"
  const initialSearch = searchParams.get("q") || ""
  
  const [filters, setFilters] = useState({
    search: initialSearch,
    category: initialCategory,
    rating: "Any Rating",
    priceRange: [] as string[],
    amenities: [] as string[],
    accessibility: [] as string[],
    paymentMethods: [] as string[],
    serviceOptions: [] as string[],
  })

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("page", page.toString())
        if (filters.search) params.set("q", filters.search)
        if (filters.category && filters.category !== "All Categories") params.set("category", filters.category)
        if (filters.rating && filters.rating !== "Any Rating") params.set("rating", filters.rating)
        
        // Use the new search API
        const res = await fetch(`/api/search?${params.toString()}`)
        if (!res.ok) {
          throw new Error('Failed to fetch businesses')
        }
        const data = await res.json()
        setBusinesses(data.businesses || [])
        setTotalResults(data.total || 0)
      } catch (error) {
        console.error('Error fetching businesses:', error)
        setBusinesses([])
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    }
    fetchBusinesses()
  }, [filters, page])

  const handleFiltersChange = (newFilters: {
    search: string
    category: string
    rating: string
    priceRange: string[]
    amenities: string[]
    accessibility: string[]
    paymentMethods: string[]
    serviceOptions: string[]
  }) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page on filter change
  }

  const totalPages = Math.ceil(totalResults / 9)

  // Generate page title based on filters
  const getPageTitle = () => {
    if (filters.search) {
      return `Search Results for "${filters.search}"`
    }
    if (filters.category !== "All Categories") {
      return `${filters.category} Businesses`
    }
    return "Browse Businesses"
  }

  // Generate page description
  const getPageDescription = () => {
    let description = `${totalResults} businesses found`
    if (filters.category !== "All Categories") {
      description += ` in ${filters.category}`
    }
    
    // Add advanced filter information
    const activeFilters = []
    if (filters.amenities.length > 0) activeFilters.push(`${filters.amenities.length} amenities`)
    if (filters.accessibility.length > 0) activeFilters.push(`${filters.accessibility.length} accessibility features`)
    if (filters.paymentMethods.length > 0) activeFilters.push(`${filters.paymentMethods.length} payment methods`)
    if (filters.serviceOptions.length > 0) activeFilters.push(`${filters.serviceOptions.length} service options`)
    
    if (activeFilters.length > 0) {
      description += ` with ${activeFilters.join(", ")}`
    }
    
    return description
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.category !== "All Categories") count++
    if (filters.rating !== "Any Rating") count++
    if (filters.priceRange.length > 0) count++
    if (filters.amenities.length > 0) count++
    if (filters.accessibility.length > 0) count++
    if (filters.paymentMethods.length > 0) count++
    if (filters.serviceOptions.length > 0) count++
    return count
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Spacing between header and search section */}
      <div className="pt-8 sm:pt-12 lg:pt-16 xl:pt-20"></div>
      
      <AdvancedSearchFilters 
        onFiltersChange={handleFiltersChange} 
        totalResults={totalResults}
        initialFilters={{
          search: initialSearch,
          category: initialCategory
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Modern Header Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                    <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl blur-xl opacity-60"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900">
                      {getPageTitle()}
                    </h1>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-base sm:text-lg font-medium">{getPageDescription()}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <span>Live results</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Updated now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Stats Cards */}
            {getActiveFilterCount() > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200/50 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                    <Filter className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Filters</p>
                    <p className="text-xl font-bold text-gray-900">{getActiveFilterCount()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200/50 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Results</p>
                    <p className="text-xl font-bold text-gray-900">{(totalResults || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Filter Summary Cards */}
          {getActiveFilterCount() > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {filters.search && (
                <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary to-purple-600 rounded-full flex-shrink-0"></div>
                    <Search className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Search</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 truncate">&quot;{filters.search}&quot;</p>
                </div>
              )}
              
              {filters.category !== "All Categories" && (
                <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex-shrink-0"></div>
                    <Building2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Category</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 truncate">{filters.category}</p>
                </div>
              )}

              {filters.rating !== "Any Rating" && (
                <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex-shrink-0"></div>
                    <Star className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Rating</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 truncate">{filters.rating}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Business Grid */}
        <div className="mb-12 sm:mb-16">
          <BusinessGrid businesses={businesses} loading={loading} />
        </div>

        {/* Modern Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 shadow-xl">
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              {/* Page Info - Centered */}
              <div className="text-center w-full">
                <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  Page {page} of {totalPages}
                </p>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Showing {((page - 1) * 9) + 1}-{Math.min(page * 9, totalResults)} of {(totalResults || 0).toLocaleString()} businesses
                </p>
              </div>

              {/* Navigation Controls - Centered */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 w-full max-w-4xl mx-auto">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white rounded-2xl transition-all duration-300 disabled:opacity-50 w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>

                {/* Page Numbers - Centered */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 flex-wrap">
                  {/* Show first page if not in range */}
                  {page > 3 && totalPages > 5 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl transition-all duration-300 font-bold text-xs sm:text-sm bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md"
                      >
                        1
                      </Button>
                      <span className="text-gray-400 text-xs sm:text-sm px-1 sm:px-2">...</span>
                    </>
                  )}

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                    if (pageNum > totalPages) return null
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl transition-all duration-300 font-bold text-xs sm:text-sm ${
                          pageNum === page 
                            ? "bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg" 
                            : "bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  {/* Show last page if not in range */}
                  {page < totalPages - 2 && totalPages > 5 && (
                    <>
                      <span className="text-gray-400 text-xs sm:text-sm px-1 sm:px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(totalPages)}
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl transition-all duration-300 font-bold text-xs sm:text-sm bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white rounded-2xl transition-all duration-300 disabled:opacity-50 w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3" />
                </Button>
              </div>

              {/* Mobile Quick Navigation - Centered */}
              <div className="flex items-center justify-center gap-2 sm:hidden w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white rounded-xl transition-all duration-300 disabled:opacity-50 px-3 py-1 text-xs"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white rounded-xl transition-all duration-300 disabled:opacity-50 px-3 py-1 text-xs"
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modern No Results State */}
        {!loading && businesses.length === 0 && (
          <div className="text-center py-16 sm:py-20 lg:py-24">
            <div className="relative mx-auto mb-8 sm:mb-12">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto">
                <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-3xl blur-xl opacity-60"></div>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              No businesses found
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed">
              Try adjusting your search criteria or filters to find more businesses.
            </p>
            <Button
              onClick={() => {
                setFilters({
                  search: "",
                  category: "All Categories",
                  rating: "Any Rating",
                  priceRange: [],
                  amenities: [],
                  accessibility: [],
                  paymentMethods: [],
                  serviceOptions: [],
                })
              }}
              className="bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 rounded-2xl font-semibold transition-all duration-300 px-8 py-4 text-base sm:text-lg shadow-lg hover:shadow-xl"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

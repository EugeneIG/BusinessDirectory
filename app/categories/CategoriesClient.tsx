"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sparkles, Building2, TrendingUp, Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Category {
  category_id: string
  name: string
  url: string
  count: number
  description: string
  created_at: string
  updated_at: string
}

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        const search = searchParams.get("search")
        if (search) params.set("search", search)
        params.set("page", page.toString())

        const response = await fetch(`/api/categories?${params.toString()}`)
        const data = await response.json()
        setCategories(data.categories)
        setTotal(data.total)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [searchParams, page])

  const totalPages = Math.ceil(total / 50)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl blur-xl opacity-60"></div>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="pt-8 sm:pt-12 lg:pt-16"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
            <div className="flex-1">
              <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                    <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl blur-xl opacity-60"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Categories
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
                    Browse all {total.toLocaleString()} categories and discover businesses in each category
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
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

            {/* Stats Cards */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200/50 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Categories</p>
                  <p className="text-xl font-bold text-gray-900">{total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200/50 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Businesses</p>
                  <p className="text-xl font-bold text-gray-900">
                    {categories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              href={`/businesses?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/50 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2 truncate">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {category.count.toLocaleString()} businesses
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
                    <span>Explore category</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
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
                  Showing {((page - 1) * 50) + 1}-{Math.min(page * 50, total)} of {total.toLocaleString()} categories
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

        {/* No Results State */}
        {categories.length === 0 && (
          <div className="text-center py-16 sm:py-20 lg:py-24">
            <div className="relative mx-auto mb-8 sm:mb-12">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto">
                <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-3xl blur-xl opacity-60"></div>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              No categories found
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed">
              Try adjusting your search criteria to find more categories.
            </p>
            <Button
              onClick={() => {
                window.location.href = '/categories'
              }}
              className="bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 rounded-2xl font-semibold transition-all duration-300 px-8 py-4 text-base sm:text-lg shadow-lg hover:shadow-xl"
            >
              View All Categories
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 
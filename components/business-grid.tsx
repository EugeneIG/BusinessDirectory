"use client"

import { BusinessCard } from "./business-card"

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
  phone?: string
  website?: string
  thumbnail: string
  city: string
  country: string
  category: string
  distance?: number
  price?: string
}

interface BusinessGridProps {
  businesses: Business[]
  loading?: boolean
}

export function BusinessGrid({ businesses, loading = false }: BusinessGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg animate-pulse">
            <div className="bg-gray-200 h-48 rounded-2xl mb-6"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="flex gap-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex gap-3 pt-4">
                <div className="h-10 bg-gray-200 rounded-2xl flex-1"></div>
                <div className="h-10 bg-gray-200 rounded-2xl w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Return empty div when no businesses to avoid duplicate "No businesses found" messages
  // The parent page will handle the empty state
  if (businesses.length === 0) {
    return <div></div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {businesses.map((business) => (
        <BusinessCard key={business.place_id} business={business} />
      ))}
    </div>
  )
}

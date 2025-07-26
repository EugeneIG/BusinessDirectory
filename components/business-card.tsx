"use client"

import { Star, MapPin, Clock, Phone, Globe, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface BusinessCardProps {
  business: {
    title: string
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
    url: string
  }
}

export function BusinessCard({ business }: BusinessCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getPriceDisplay = (price?: string) => {
    if (!price) return null
    return (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3 text-gray-500" />
        <span className="text-xs sm:text-sm font-medium text-gray-600">{price}</span>
      </div>
    )
  }

  return (
    <Link href={`/business/${business.url}`} className="block group h-full">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Image section - fixed height */}
          <div className="relative mb-4 sm:mb-6 flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl h-32 sm:h-40 md:h-48">
              <Image
                src={business.thumbnail || "/def.png"}
                alt={business.title}
                width={400}
                height={200}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/def.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Distance badge */}
            {business.distance && (
              <Badge className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 text-gray-700 border border-gray-200 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow-lg">
                {business.distance.toFixed(1)}km away
              </Badge>
            )}
          </div>

          {/* Content section - flex-grow to fill remaining space */}
          <div className="space-y-3 sm:space-y-4 flex-grow flex flex-col">
            {/* Title and rating */}
            <div className="flex items-start justify-between flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-primary transition-colors duration-300 mb-1 sm:mb-2 line-clamp-2 h-12 sm:h-14 flex items-center">
                  {business.title}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {renderStars(business.rating)}
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">{business.rating}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">({business.reviews} reviews)</span>
                </div>
              </div>
              {getPriceDisplay(business.price)}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 sm:gap-2 flex-shrink-0">
              <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 rounded-full px-2 sm:px-3 py-1 text-xs font-medium">
                {business.category}
              </Badge>
              {Array.isArray(business.types) && business.types.slice(0, 1).map((type, index) => (
                <Badge key={index} className="bg-gray-100 text-gray-900 border border-gray-200 rounded-full px-2 sm:px-3 py-1 text-xs font-medium">
                  {type}
                </Badge>
              ))}
            </div>

            {/* Details - fixed height with consistent spacing */}
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm flex-grow">
              {business.address && (
                <div className="flex items-start gap-2 sm:gap-3 text-gray-600 min-h-[1.25rem] sm:min-h-[1.5rem]">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400 mt-0.5" />
                  <span className="truncate leading-relaxed">{business.address}</span>
                </div>
              )}

              {business.open_state && (
                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 min-h-[1.25rem] sm:min-h-[1.5rem]">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{business.open_state}</span>
                </div>
              )}

              {business.phone && (
                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 min-h-[1.25rem] sm:min-h-[1.5rem]">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{business.phone}</span>
                </div>
              )}

              {business.website && (
                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 min-h-[1.25rem] sm:min-h-[1.5rem]">
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400" />
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary truncate font-medium hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Website
                  </a>
                </div>
              )}

              {/* Add spacing if no details are shown to maintain card height */}
              {!business.address && !business.open_state && !business.phone && !business.website && (
                <div className="min-h-[1.25rem] sm:min-h-[1.5rem]"></div>
              )}
            </div>

            {/* Call to action - fixed at bottom */}
            <div className="pt-2 sm:pt-4 flex-shrink-0">
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white text-center py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                View Details
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

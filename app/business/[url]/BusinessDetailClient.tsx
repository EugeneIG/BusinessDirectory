"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Mail,
  DollarSign,
  Accessibility,
  CreditCard,
  Car,
  Users,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Share2,
  ExternalLink,
  Sparkles,
  Building2,
  Award,
  Heart,
} from "lucide-react"
import Image from "next/image"
import Script from "next/script"
import { BusinessDetailSkeleton } from "@/components/business-detail-skeleton"

interface BusinessDetailClientProps {
  url: string
}

export default function BusinessDetailClient({ url }: BusinessDetailClientProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [business, setBusiness] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/businesses/place/${url}`)
        
        if (!res.ok) {
          setError('Business not found')
          return
        }
        
        const businessData = await res.json()
        
        if (!businessData || businessData.error) {
          setError('Business not found')
          return
        }

        // Parse JSON-stringified fields if necessary
        const parseIfString = (field: unknown) => {
          if (typeof field === 'string') {
            try {
              return JSON.parse(field)
            } catch {
              return field
            }
          }
          return field
        }

        // Parse numeric fields
        const parseNumericField = (field: unknown) => {
          if (typeof field === 'string') {
            const parsed = parseFloat(field)
            return isNaN(parsed) ? 0 : parsed
          }
          return typeof field === 'number' ? field : 0
        }

        businessData.service_option = parseIfString(businessData.service_option)
        businessData.operating_hours = parseIfString(businessData.operating_hours)
        businessData.email = parseIfString(businessData.email)
        
        // Parse numeric fields
        businessData.rating = parseNumericField(businessData.rating)
        businessData.reviews = parseNumericField(businessData.reviews)
        businessData.reviews_per_1 = parseNumericField(businessData.reviews_per_1)
        businessData.reviews_per_2 = parseNumericField(businessData.reviews_per_2)
        businessData.reviews_per_3 = parseNumericField(businessData.reviews_per_3)
        businessData.reviews_per_4 = parseNumericField(businessData.reviews_per_4)
        businessData.reviews_per_5 = parseNumericField(businessData.reviews_per_5)

        setBusiness(businessData)
      } catch (err) {
        console.error('Error fetching business:', err)
        setError('Failed to load business details')
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [url])

  // Generate SEO schema for the business
  const generateBusinessSchema = () => {
    if (!business) return null

    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": business.title || "Unknown Business",
      "description": business.note_from_owner || `${business.title || "Business"} - ${business.category || "General"}`,
      "image": business.thumbnail || "/def.png",
      "url": business.website || `${window.location.origin}/business/${url}`,
      "telephone": business.phone || undefined,
      "email": Array.isArray(business.email) && business.email.length > 0 ? business.email[0] : undefined,
      "address": business.address ? {
        "@type": "PostalAddress",
        "streetAddress": business.address,
        "addressLocality": business.city || "",
        "addressRegion": business.state || "",
        "postalCode": business.postal_code || "",
        "addressCountry": "US"
      } : undefined,
      "geo": (business.latitude && business.longitude) ? {
        "@type": "GeoCoordinates",
        "latitude": business.latitude,
        "longitude": business.longitude
      } : undefined,
      "priceRange": business.price || undefined,
      "category": business.category || undefined,
      "aggregateRating": business.rating > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": business.rating,
        "reviewCount": business.reviews,
        "bestRating": 5,
        "worstRating": 1
      } : undefined,
      "openingHoursSpecification": business.operating_hours ? Object.entries(business.operating_hours)
        .filter(([, hours]) => hours !== null && hours !== undefined)
        .map(([day, hours]) => {
          const hoursStr = hours?.toString() || '';
          const [opens, closes] = hoursStr.split('-');
          return {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
            "opens": opens?.trim() || undefined,
            "closes": closes?.trim() || undefined
          };
        }) : undefined,
      "sameAs": [
        ...(business.facebook ? [business.facebook] : []),
        ...(business.twitter ? [business.twitter] : []),
        ...(business.instagram ? [business.instagram] : []),
        ...(business.linkedin ? [business.linkedin] : []),
        ...(business.youtube ? [business.youtube] : [])
      ].filter(Boolean),
      "hasOfferCatalog": business.service_option ? {
        "@type": "OfferCatalog",
        "name": "Services and Amenities",
        "itemListElement": business.service_option
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((section: any) => section && section.options && Array.isArray(section.options))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .flatMap((section: any) => 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            section.options.map((option: any) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": option?.name || "Unknown Service",
                "category": section?.name || "General"
              }
            }))
          )
      } : undefined
    }

    // Remove undefined values
    return JSON.parse(JSON.stringify(schema, (key, value) => 
      value === undefined ? undefined : value
    ))
  }

  if (loading) {
    return <BusinessDetailSkeleton />
  }

  if (error || !business) {
    notFound()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }



  const getSocialMediaIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />
      case 'twitter':
        return <Twitter className="h-5 w-5" />
      case 'instagram':
        return <Instagram className="h-5 w-5" />
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />
      case 'youtube':
        return <Youtube className="h-5 w-5" />
      default:
        return <ExternalLink className="h-5 w-5" />
    }
  }

  const getSocialMediaLinks = () => {
    const links = []
    if (business.facebook) links.push({ platform: 'Facebook', url: business.facebook })
    if (business.twitter) links.push({ platform: 'Twitter', url: business.twitter })
    if (business.instagram) links.push({ platform: 'Instagram', url: business.instagram })
    if (business.linkedin) links.push({ platform: 'LinkedIn', url: business.linkedin })
    if (business.youtube) links.push({ platform: 'YouTube', url: business.youtube })
    return links
  }

  const businessSchema = generateBusinessSchema()

  return (
    <>
      {/* SEO Schema */}
      {businessSchema && (
        <Script
          id="business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema)
          }}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="pt-8 sm:pt-12 lg:pt-16"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
                  <Image
                    src={business.thumbnail || "/def.png"}
                    alt={business.title}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/def.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 leading-tight truncate">
                          {business.title}
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              {renderStars(business.rating)}
                              <span className="text-sm sm:text-lg md:text-xl font-bold ml-1 sm:ml-2">
                                {business.rating > 0 ? business.rating : 'N/A'}
                              </span>
                            </div>
                            <span className="text-white/90 text-xs sm:text-sm md:text-lg">({business.reviews.toLocaleString()} reviews)</span>
                          </div>
                          {business.price && (
                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full w-fit">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="font-semibold text-xs sm:text-sm md:text-base truncate">{business.price}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                        <Button size="sm" variant="secondary" className="bg-primary/20 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary/30 rounded-xl sm:rounded-2xl transition-all duration-300 px-2 sm:px-3">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-primary" />
                          <span className="text-xs sm:text-sm hidden sm:inline text-primary">Save</span>
                        </Button>
                        <Button size="sm" variant="secondary" className="bg-primary/20 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary/30 rounded-xl sm:rounded-2xl transition-all duration-300 px-2 sm:px-3">
                          <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-primary" />
                          <span className="text-xs sm:text-sm hidden sm:inline text-primary">Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-xl">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {business.category}
                  </Badge>
                  {Array.isArray(business.types) && business.types
                    .filter((type: string) => type && typeof type === 'string')
                    .map((type: string, index: number) => (
                      <Badge key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {type}
                      </Badge>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Address</p>
                        <p className="text-gray-600">{business.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Hours</p>
                        <p className="text-gray-600">{business.open_state}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {business.phone && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Phone</p>
                          <a href={`tel:${business.phone}`} className="text-primary hover:underline font-medium">
                            {business.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {business.website && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Globe className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Website</p>
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}

                    {business.email && business.email.length > 0 && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Email</p>
                          <a href={`mailto:${business.email[0]}`} className="text-primary hover:underline font-medium">
                            {business.email[0]}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {business.note_from_owner && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">About This Business</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{business.note_from_owner}</p>
                  </div>
                )}

                {/* Social Media Links */}
                {getSocialMediaLinks().length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
                      Follow Us
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {getSocialMediaLinks().map((link, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-white/90 backdrop-blur-sm border-gray-200/50 hover:bg-white rounded-2xl transition-all duration-300"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            {getSocialMediaIcon(link.platform)}
                            <span className="ml-2">{link.platform}</span>
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Service Options */}
              {Array.isArray(business.service_option) && business.service_option.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Services & Amenities</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {business.service_option
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .filter((section: any) => section && section.name && section.options && Array.isArray(section.options))
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .map((section: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50/50 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            {section.slug === "accessibility" && (
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                <Accessibility className="h-4 w-4 text-white" />
                              </div>
                            )}
                            {section.slug === "payments" && (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                                <CreditCard className="h-4 w-4 text-white" />
                              </div>
                            )}
                            {section.slug === "parking" && (
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                <Car className="h-4 w-4 text-white" />
                              </div>
                            )}
                            {section.slug === "children" && (
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                            )}
                            <h3 className="font-semibold text-gray-900">{section.name}</h3>
                          </div>
                          <ul className="space-y-2">
                            {section.options
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              .filter((option: any) => option && option.name)
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              .map((option: any, optionIndex: number) => (
                                <li key={optionIndex} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-purple-600 rounded-full flex-shrink-0" />
                                  <span className="text-gray-600">{option.name}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  {business.phone && (
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl" asChild>
                      <a href={`tel:${business.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  )}
                  {business.website && (
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-500/90 hover:to-teal-600/90 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl" asChild>
                      <a href={business.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-500/90 hover:to-cyan-600/90 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl" asChild>
                    <a href={business.place_url} target="_blank" rel="noopener noreferrer">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>

              {/* Operating Hours */}
              {business.operating_hours && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Operating Hours</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(business.operating_hours)
                      .filter(([, hours]) => hours !== null && hours !== undefined)
                      .map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                          <span className="font-medium text-gray-900 capitalize">{day}</span>
                          <span className="text-gray-600">{hours?.toString() || 'Closed'}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Reviews Summary */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Reviews Summary</h3>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {business.rating > 0 ? business.rating : 'N/A'}
                  </div>
                  <div className="flex justify-center mb-3">{renderStars(business.rating)}</div>
                  <p className="text-gray-600">{business.reviews.toLocaleString()} total reviews</p>
                </div>

                {business.reviews_per_5 > 0 && (
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star: number) => {
                      const key = `reviews_per_${star}` as keyof typeof business;
                      const count = business[key] as number;
                      const percentage = business.reviews > 0 ? (count / business.reviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <span className="w-4 font-medium text-gray-900">{star}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-gray-600 w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
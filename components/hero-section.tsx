"use client"

import type React from "react"

import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredCategories, setFeaturedCategories] = useState<Array<{name: string, icon: string}>>([])
  const router = useRouter()

  // Fetch random categories for featured section
  useEffect(() => {
    const fetchRandomCategories = async () => {
      try {
        const response = await fetch('/api/categories/all')
        const data = await response.json()
        
        if (data.categories && data.categories.length > 0) {
          // Shuffle and take first 5 categories
          const shuffled = [...data.categories].sort(() => Math.random() - 0.5)
          const randomCategories = shuffled.slice(0, 5)
          
          // Array of positive and happy face emojis to choose from
          const randomIcons = [
            '😊', '😄', '😃', '😁', '😆', '😅', '😂', '🤣', '😉', '😋',
            '😎', '😍', '🥰', '😘', '😗', '😙', '😚', '🙂', '🤗', '😇',
            '🥳', '😌', '😛', '😜', '😝', '🙃', '😲', '🤪', '😺', '😸',
            '😹', '😻', '😽', '🤠', '🤡', '🤭', '🧐', '🤓', '🥺', '🥴',
            '🤤', '😏', '😶', '🤐', '😯', '😮', '😴', '😪', '😫', '😌'
          ]
          
          const categoriesWithIcons = randomCategories.map(category => ({
            name: category.name,
            icon: randomIcons[Math.floor(Math.random() * randomIcons.length)] // Random icon
          }))
          
          setFeaturedCategories(categoriesWithIcons)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to default categories if API fails
        setFeaturedCategories([
          { name: "Restaurants", icon: "🍽️" },
          { name: "Healthcare", icon: "🏥" },
          { name: "Shopping", icon: "🛍️" },
          { name: "Services", icon: "🔧" },
          { name: "Entertainment", icon: "🎭" }
        ])
      }
    }
    
    fetchRandomCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    const params = new URLSearchParams()
    params.set("q", searchQuery.trim())
    router.push(`/businesses?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-primary" />
            Discover the best local businesses
          </div>

          {/* Main heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Find Amazing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-blue-600">
              Local Businesses
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with trusted local businesses, discover hidden gems, and support your community. 
            From cozy cafes to professional services, find exactly what you need.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col lg:flex-row gap-4 p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 border-0 focus-visible:ring-0 text-lg h-14 bg-transparent placeholder:text-gray-500"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-14 px-8 bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Popular categories */}
          <div className="flex flex-wrap justify-center gap-4">
            {featuredCategories.map((category) => (
              <Button 
                key={category.name}
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set("category", category.name)
                  router.push(`/businesses?${params.toString()}`)
                }}
                className="bg-white/80 backdrop-blur-sm !text-gray-900 hover:bg-white/90 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium px-6 py-3"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Local Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

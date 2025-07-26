import { Skeleton } from "@/components/ui/skeleton"

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <Skeleton className="h-16 w-96 mx-auto mb-8" />
          <Skeleton className="h-8 w-2/3 mx-auto mb-12" />
          
          {/* Search form skeleton */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
              <div className="flex-1 relative">
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
              <div className="flex-1 relative">
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-12 w-32 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section Skeleton */}
      <section className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-48 mx-auto mb-6" />
            <Skeleton className="h-16 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          
          {/* Business Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg">
                <Skeleton className="h-48 w-full rounded-2xl mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-10 flex-1 rounded-2xl" />
                    <Skeleton className="h-10 w-24 rounded-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions Skeleton */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <Skeleton className="h-16 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="group text-center">
                <div className="relative mb-8">
                  <Skeleton className="w-20 h-20 rounded-2xl mx-auto" />
                </div>
                <Skeleton className="h-8 w-48 mx-auto mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 
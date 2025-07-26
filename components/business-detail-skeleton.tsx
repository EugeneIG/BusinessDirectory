import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function BusinessDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="pt-8 sm:pt-12 lg:pt-16"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section Skeleton */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
              <Skeleton className="h-48 sm:h-64 md:h-80 lg:h-96 w-full" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-3/4 mb-2 sm:mb-3" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Skeleton key={i} className="h-5 w-5 rounded" />
                            ))}
                          </div>
                          <Skeleton className="h-4 w-8 ml-1 sm:ml-2" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                    <Skeleton className="h-8 w-16 rounded-xl sm:rounded-2xl" />
                    <Skeleton className="h-8 w-16 rounded-xl sm:rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Info Skeleton */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-xl">
              <CardContent className="p-0">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                      <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                      <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                      <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                      <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl">
                      <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="w-8 h-8 rounded-xl" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-24 rounded-2xl" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Options Skeleton */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-10 h-10 rounded-2xl" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, sectionIndex) => (
                    <div key={sectionIndex} className="p-4 bg-gray-50/50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="w-8 h-8 rounded-xl" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <ul className="space-y-2">
                        {Array.from({ length: 4 }).map((_, optionIndex) => (
                          <li key={optionIndex} className="flex items-center gap-2">
                            <Skeleton className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
                            <Skeleton className="h-4 w-32" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Quick Actions Skeleton */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-2xl" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours Skeleton */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Summary Skeleton */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="text-center mb-6">
                  <Skeleton className="h-10 w-16 mx-auto mb-2" />
                  <div className="flex justify-center mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4 mx-0.5 rounded" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-32 mx-auto" />
                </div>

                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-3 w-3 rounded" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <Skeleton className="h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }} />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 
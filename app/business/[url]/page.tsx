import { Suspense } from "react"
import BusinessDetailClient from "./BusinessDetailClient"

interface BusinessDetailPageProps {
  params: Promise<{ url: string }>
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const { url } = await params
  
  return (
    <Suspense fallback={<div>Loading business details...</div>}>
      <BusinessDetailClient url={url} />
    </Suspense>
  )
}

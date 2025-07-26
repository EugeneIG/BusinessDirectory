import { NextResponse, NextRequest } from "next/server"
import { Client } from 'pg'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ url: string }> }
) {
  const { url } = await params
  
  // Get PostgreSQL client
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM businesses WHERE url = $1', [url])
    const business = result.rows[0]
    
    await client.end()
    
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }
    
    return NextResponse.json(business)
  } catch (error) {
    console.error("Error fetching business:", error)
    await client.end()
    return NextResponse.json(
      { error: "Failed to fetch business", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
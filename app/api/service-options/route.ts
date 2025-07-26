import { NextResponse, NextRequest } from "next/server"
import { Client } from 'pg'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!)
  const category = searchParams.get("category") || ""

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

    let query = `
      SELECT 
        so.option_id,
        so.name,
        so.slug,
        so.business_count,
        sc.name as category_name,
        sc.slug as category_slug
      FROM service_options so
      JOIN service_categories sc ON so.category_id = sc.category_id
    `
    
    const params: string[] = []
    
    if (category) {
      query += " WHERE sc.slug = $1"
      params.push(category)
    }
    
    query += " ORDER BY so.business_count DESC"
    
    const result = await client.query(query, params)
    const options = result.rows

    await client.end()
    return NextResponse.json({ options })
  } catch (error) {
    console.error("Error fetching service options:", error)
    await client.end()
    return NextResponse.json(
      { error: "Failed to fetch service options", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
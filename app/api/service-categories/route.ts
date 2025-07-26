import { NextResponse } from "next/server"
import { Client } from 'pg'

export async function GET() {
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

    const query = `
      SELECT 
        sc.category_id,
        sc.name,
        sc.slug,
        sc.description,
        COUNT(so.option_id) as option_count,
        SUM(so.business_count) as total_businesses
      FROM service_categories sc
      LEFT JOIN service_options so ON sc.category_id = so.category_id
      GROUP BY sc.category_id
      ORDER BY total_businesses DESC
    `
    
    const result = await client.query(query)
    const categories = result.rows

    await client.end()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching service categories:", error)
    await client.end()
    return NextResponse.json(
      { error: "Failed to fetch service categories", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
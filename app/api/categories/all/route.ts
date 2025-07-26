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

    // Get all categories ordered by count (most popular first)
    const result = await client.query(`SELECT category_id, name, url, count FROM categories ORDER BY count DESC`)
    const categories = result.rows

    await client.end()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    await client.end()
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
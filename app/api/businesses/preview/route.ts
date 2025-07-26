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
    const result = await client.query('SELECT * FROM businesses LIMIT 10')
    const businesses = result.rows
    
    await client.end()
    return NextResponse.json(businesses)
  } catch (error) {
    console.error("Error fetching preview businesses:", error)
    await client.end()
    return NextResponse.json(
      { error: "Failed to fetch preview businesses", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
import { NextResponse, NextRequest } from "next/server"
import { Client } from 'pg'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const pageSize = 9
  const offset = (page - 1) * pageSize

  // Search query
  const searchQuery = searchParams.get("q")?.toLowerCase() || ""
  const category = searchParams.get("category") || "All Categories"
  const rating = searchParams.get("rating") || "Any Rating"

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

    // Build SQL query dynamically
    const whereClauses: string[] = []
    const params: (string | number)[] = []
    let paramIndex = 1

    // Enhanced search with LIKE queries for better matching
    if (searchQuery) {
      whereClauses.push(`(
        LOWER(b.title) LIKE $${paramIndex} OR 
        LOWER(b.category) LIKE $${paramIndex} OR 
        LOWER(b.address) LIKE $${paramIndex} OR
        LOWER(b.city) LIKE $${paramIndex} OR
        LOWER(b.description_arr) LIKE $${paramIndex} OR
        LOWER(b.type) LIKE $${paramIndex}
      )`)
      params.push(`%${searchQuery}%`)
      paramIndex++
    }

    if (category !== "All Categories") {
      whereClauses.push(`b.category = $${paramIndex}`)
      params.push(category)
      paramIndex++
    }

    if (rating !== "Any Rating") {
      whereClauses.push(`b.rating >= $${paramIndex}`)
      params.push(parseFloat(rating.replace("+", "")))
      paramIndex++
    }

    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM businesses b ${where}`
    const countResult = await client.query(countQuery, params)
    const total = parseInt(countResult.rows[0]?.count || '0')

    // Get paginated results with proper sorting to ensure unique pagination
    let orderBy = "b.data_id ASC" // Always include a unique identifier for consistent sorting
    const queryParams = [...params]
    
    if (searchQuery) {
      // If there's a search query, prioritize exact matches and partial matches
      orderBy = `
        CASE 
          WHEN LOWER(b.title) LIKE $${paramIndex} THEN 1
          WHEN LOWER(b.category) LIKE $${paramIndex} THEN 2
          WHEN LOWER(b.address) LIKE $${paramIndex} THEN 3
          ELSE 4
        END,
        b.rating DESC, 
        b.reviews DESC,
        b.data_id ASC
      `
      queryParams.push(`%${searchQuery}%`)
      paramIndex++
    } else {
      // Default sorting when no search query
      orderBy = "b.rating DESC, b.reviews DESC, b.data_id ASC"
    }

    const sqlQuery = `SELECT * FROM businesses b ${where} ORDER BY ${orderBy} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    queryParams.push(pageSize, offset)
    const result = await client.query(sqlQuery, queryParams)
    const businesses = result.rows

    await client.end()
    return NextResponse.json({ total, businesses })
  } catch (error) {
    console.error('Database query error:', error);
    await client.end()
    return NextResponse.json(
      { error: 'Database query failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
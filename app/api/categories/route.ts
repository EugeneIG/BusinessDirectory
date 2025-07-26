import { NextResponse, NextRequest } from "next/server"
import { Client } from 'pg'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const pageSize = parseInt(searchParams.get("pageSize") || "50", 10)
  const offset = (page - 1) * pageSize

  // Filters
  const search = searchParams.get("search")?.toLowerCase() || ""

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
    const params: string[] = []

    if (search) {
      whereClauses.push("(LOWER(name) LIKE $1 OR LOWER(description) LIKE $1)")
      params.push(`%${search}%`)
    }

    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""

    // Get total count
    const countResult = await client.query(`SELECT COUNT(*) as count FROM categories ${where}`, params)
    const total = parseInt(countResult.rows[0]?.count || '0')

    // Get paginated results
    const query = `SELECT * FROM categories ${where} ORDER BY category_id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    const queryParams = [...params, pageSize, offset]
    const result = await client.query(query, queryParams)
    const categories = result.rows

    await client.end()
    return NextResponse.json({ total, categories })
  } catch (error) {
    console.error('Database query error:', error);
    await client.end()
    return NextResponse.json(
      { error: 'Database query failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
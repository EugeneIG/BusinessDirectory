import { Client, ClientConfig, QueryResult } from 'pg'

// Database configuration
const dbConfig: ClientConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000, // 5 seconds
  query_timeout: 10000, // 10 seconds
}

/**
 * Execute a database query with a new client for each request
 * This approach works better in serverless environments
 * @param query - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export async function executeQuery(query: string, params: (string | number)[] = []): Promise<QueryResult> {
  const client = new Client(dbConfig)
  
  try {
    console.log('Connecting to database...')
    await client.connect()
    console.log('Database connected, executing query...')
    
    const result = await client.query(query, params)
    console.log('Query executed successfully, rows:', result.rows.length)
    
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  } finally {
    console.log('Closing database connection...')
    await client.end()
  }
}

/**
 * Database utility with common operations
 */
export const db = {
  /**
   * Get a single record
   */
  async getOne<T = Record<string, unknown>>(query: string, params: (string | number)[] = []): Promise<T | null> {
    const result = await executeQuery(query, params)
    return result.rows[0] || null
  },

  /**
   * Get multiple records
   */
  async getMany<T = Record<string, unknown>>(query: string, params: (string | number)[] = []): Promise<T[]> {
    const result = await executeQuery(query, params)
    return result.rows
  },

  /**
   * Execute an insert, update, or delete query
   */
  async execute(query: string, params: (string | number)[] = []): Promise<QueryResult> {
    return await executeQuery(query, params)
  },

  /**
   * Get count of records
   */
  async getCount(query: string, params: (string | number)[] = []): Promise<number> {
    const result = await executeQuery(query, params)
    return parseInt(result.rows[0]?.count || '0')
  }
} 
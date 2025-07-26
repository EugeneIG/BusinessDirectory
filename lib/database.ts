import { QueryResult, Pool, PoolConfig } from 'pg'

// Database configuration
const dbConfig: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  // Connection pool settings for serverless
  max: 1, // Single connection for serverless
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 5000, // 5 seconds
  maxUses: 7500, // Number of times a connection can be used before being destroyed
}

// Connection pool instance
let pool: Pool | null = null

/**
 * Get a PostgreSQL connection pool
 * Creates a new pool if one doesn't exist
 */
export async function getPool(): Promise<Pool> {
  if (!pool) {
    console.log('Creating new database pool...')
    console.log('Database config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      ssl: dbConfig.ssl ? 'enabled' : 'disabled'
    })
    
    pool = new Pool(dbConfig)
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
      pool = null
    })
    
    pool.on('connect', () => {
      console.log('Database pool connected')
    })
    
    pool.on('acquire', () => {
      console.log('Database connection acquired')
    })
    
    pool.on('release', () => {
      console.log('Database connection released')
    })
  }
  
  return pool
}

/**
 * Execute a database query with automatic connection management and timeout
 * @param query - SQL query string
 * @param params - Query parameters
 * @param timeout - Timeout in milliseconds (default: 10000ms)
 * @returns Query result
 */
export async function executeQuery(query: string, params: (string | number)[] = [], timeout: number = 10000): Promise<QueryResult> {
  console.log('Executing query:', query.substring(0, 100) + '...')
  
  const pool = await getPool()
  
  return new Promise((resolve, reject) => {
    // Set timeout
    const timeoutId = setTimeout(() => {
      console.error('Database query timeout after', timeout, 'ms')
      reject(new Error('Database query timeout'))
    }, timeout)
    
    pool.query(query, params, (err, result) => {
      clearTimeout(timeoutId)
      
      if (err) {
        console.error('Database query error:', err)
        reject(err)
      } else {
        console.log('Query executed successfully, rows:', result.rows.length)
        resolve(result)
      }
    })
  })
}

/**
 * Close the connection pool
 * Should be called when the application is shutting down
 */
export async function closePool(): Promise<void> {
  if (pool) {
    console.log('Closing database pool...')
    await pool.end()
    pool = null
  }
}

/**
 * Database utility with common operations
 */
export const db = {
  /**
   * Get a single record
   */
  async getOne<T = Record<string, unknown>>(query: string, params: (string | number)[] = [], timeout: number = 10000): Promise<T | null> {
    const result = await executeQuery(query, params, timeout)
    return result.rows[0] || null
  },

  /**
   * Get multiple records
   */
  async getMany<T = Record<string, unknown>>(query: string, params: (string | number)[] = [], timeout: number = 10000): Promise<T[]> {
    const result = await executeQuery(query, params, timeout)
    return result.rows
  },

  /**
   * Execute an insert, update, or delete query
   */
  async execute(query: string, params: (string | number)[] = [], timeout: number = 10000): Promise<QueryResult> {
    return await executeQuery(query, params, timeout)
  },

  /**
   * Get count of records
   */
  async getCount(query: string, params: (string | number)[] = [], timeout: number = 10000): Promise<number> {
    const result = await executeQuery(query, params, timeout)
    return parseInt(result.rows[0]?.count || '0')
  }
}

// For backward compatibility
export const getClient = getPool
export const closeConnection = closePool 
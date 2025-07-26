# Database Utility

This module provides a reusable PostgreSQL client for all API routes in the application.

## Features

- **Singleton Pattern**: Maintains a single database connection across all API calls
- **Automatic Reconnection**: Handles connection loss and automatically reconnects
- **Type Safety**: Full TypeScript support with generic types
- **Error Handling**: Centralized error handling and logging
- **Connection Management**: Automatic connection lifecycle management

## Usage

### Basic Usage

```typescript
import { db } from "@/lib/database"

// Get a single record
const business = await db.getOne('SELECT * FROM businesses WHERE id = $1', [123])

// Get multiple records
const businesses = await db.getMany('SELECT * FROM businesses LIMIT 10')

// Get count
const total = await db.getCount('SELECT COUNT(*) as count FROM businesses')

// Execute insert/update/delete
await db.execute('INSERT INTO businesses (name) VALUES ($1)', ['New Business'])
```

### Advanced Usage

```typescript
import { getClient, executeQuery } from "@/lib/database"

// Get the raw client for complex operations
const client = await getClient()
const result = await client.query('SELECT * FROM businesses')

// Execute custom queries
const result = await executeQuery('SELECT * FROM businesses WHERE category = $1', ['Restaurant'])
```

## API Reference

### `db.getOne<T>(query, params?)`
Get a single record from the database.
- Returns: `Promise<T | null>`

### `db.getMany<T>(query, params?)`
Get multiple records from the database.
- Returns: `Promise<T[]>`

### `db.getCount(query, params?)`
Get the count of records.
- Returns: `Promise<number>`

### `db.execute(query, params?)`
Execute an insert, update, or delete query.
- Returns: `Promise<QueryResult>`

### `getClient()`
Get the raw PostgreSQL client instance.
- Returns: `Promise<Client>`

### `executeQuery(query, params?)`
Execute a query with the raw client.
- Returns: `Promise<QueryResult>`

### `closeConnection()`
Close the database connection (useful for cleanup).
- Returns: `Promise<void>`

## Benefits

1. **Performance**: No need to create new connections for each API call
2. **Reliability**: Automatic reconnection on connection loss
3. **Maintainability**: Centralized database configuration
4. **Type Safety**: Full TypeScript support
5. **Error Handling**: Consistent error handling across all routes

## Migration from Direct Client Usage

### Before
```typescript
import { Client } from 'pg'

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false
});

await client.connect();
const result = await client.query('SELECT * FROM businesses');
await client.end();
```

### After
```typescript
import { db } from "@/lib/database"

const businesses = await db.getMany('SELECT * FROM businesses');
```

## Environment Variables

The database utility uses the following environment variables:

- `POSTGRES_HOST`: Database host
- `POSTGRES_PORT`: Database port (default: 5432)
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_SSL`: Enable SSL (true/false) 
# PostgreSQL Database Scripts

This directory contains scripts for managing PostgreSQL database tables for the business directory application.

## Scripts Overview

### 1. `create_tables.js` - Table Creation Script
Creates all necessary PostgreSQL tables for the business directory application.

**Features:**
- Creates tables for businesses, categories, and services
- Includes proper indexes for performance
- Checks for existing tables before creation
- Validates environment variables
- Uses PostgreSQL-specific data types and constraints
- **Independent of data sync process**

**Tables Created:**
- `businesses` - Dynamic schema based on data structure
- `categories` - Business categories with metadata
- `service_categories` - Service category classifications
- `service_options` - Individual service options within categories
- `business_service_options` - Junction table linking businesses to services

**Usage:**
```bash
npm run create-tables
```

### 2. `check_tables.js` - Table Verification Script
Provides detailed information about existing database tables and their contents.

**Features:**
- Lists all tables in the database
- Shows table structure (columns, data types, constraints)
- Displays row counts for each table
- Lists indexes for performance optimization
- Provides summary statistics
- Validates that all required tables exist

**Usage:**
```bash
npm run check-tables
```

## Database Schema

### Businesses Table
- **Primary Key:** `data_id` (VARCHAR)
- **Dynamic Schema:** Adapts to your business data structure
- **Indexes:** `data_id`, `category`, `url`
- **Created:** Dynamically during sync process

### Categories Table
```sql
CREATE TABLE categories (
  category_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) UNIQUE NOT NULL,
  count INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Service Categories Table
```sql
CREATE TABLE service_categories (
  category_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Service Options Table
```sql
CREATE TABLE service_options (
  option_id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  business_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(category_id) ON DELETE CASCADE
);
```

### Business Service Options Table
```sql
CREATE TABLE business_service_options (
  business_id VARCHAR(255) NOT NULL,
  option_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (business_id, option_id),
  FOREIGN KEY (option_id) REFERENCES service_options(option_id) ON DELETE CASCADE
);
```

## Environment Variables Required

Create a `.env.local` file with the following PostgreSQL configuration:

```env
# PostgreSQL Configuration
POSTGRES_HOST=your-postgres-host.com
POSTGRES_PORT=5432
POSTGRES_DB=your-database-name
POSTGRES_USER=your-username
POSTGRES_PASSWORD=your-password
POSTGRES_SSL=true
```

## Available Commands

```bash
# Create all tables
npm run create-tables

# Check existing tables and their structure
npm run check-tables

# Sync data to PostgreSQL (requires tables to exist)
npm run sync-postgresql

# Sync with limit for testing
BUSINESS_LIMIT=100 npm run sync-postgresql
```

## Workflow

1. **Create Tables First** (one-time setup)
   ```bash
   npm run create-tables
   ```

2. **Verify Tables Exist** (optional)
   ```bash
   npm run check-tables
   ```

3. **Sync Data** (can be run multiple times)
   ```bash
   npm run sync-postgresql
   ```

**Note:** The sync script will fail if tables don't exist. Always run `create-tables` first.

## Table Status Messages

The scripts provide clear feedback about table existence:

- ✅ **All required tables exist** - Database is properly set up
- ⚠️ **Missing tables** - Some tables need to be created
- 📊 **Detailed table information** - Structure, row counts, and indexes

## Integration with Sync Scripts

These table creation scripts work seamlessly with the existing sync scripts:

- `sync-postgresql.js` - **Main PostgreSQL data synchronization script**
  - Streams data from JSON URL
  - **Requires tables to be created first** (run `create-tables` first)
  - Processes service categories and options
  - Handles batch inserts for performance
  - Supports business limits for testing
  - **Focuses only on data synchronization**
- `sync-sqlite.js` - SQLite version for local development
- `sync-d1.js` - Cloudflare D1 version

## Error Handling

The scripts include comprehensive error handling:

- Environment variable validation
- Database connection error handling
- SQL execution error reporting
- Graceful cleanup of database connections

## Performance Considerations

- All tables include appropriate indexes for common queries
- Foreign key constraints with CASCADE delete for data integrity
- Optimized data types for PostgreSQL
- Batch operations for efficient data insertion

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   Error: Missing required environment variables
   ```
   Solution: Check your `.env.local` file and ensure all PostgreSQL variables are set.

2. **Connection Errors**
   ```
   Error: connect ECONNREFUSED
   ```
   Solution: Verify your PostgreSQL host, port, and credentials.

3. **Tables Already Exist**
   ```
   The following tables already exist:
   - businesses
   - categories
   ```
   Solution: This is normal. Use `npm run check-tables` to verify the structure.

### Getting Help

- Run `npm run check-tables` to diagnose table issues
- Check the PostgreSQL setup guide in `POSTGRESQL_SETUP.md`
- Verify your database connection with a PostgreSQL client 
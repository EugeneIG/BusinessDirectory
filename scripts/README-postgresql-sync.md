# PostgreSQL Sync Script

This script provides an optimized PostgreSQL synchronization process for handling large JSON datasets without memory issues.

## Features

### Memory Optimization
- **Streaming Processing**: Uses Node.js streams to process JSON data without loading entire file into memory
- **Batch Processing**: Processes data in configurable batches (default: 1000 records)
- **Connection Pooling**: Optimized PostgreSQL connection pool with configurable settings
- **Garbage Collection**: Manual GC exposure for better memory management

### Performance Optimizations
- **Indexed Tables**: Pre-created indexes for faster queries
- **JSONB Storage**: Uses PostgreSQL JSONB for complex data structures
- **Array Types**: Utilizes PostgreSQL arrays for email and social media links
- **Upsert Operations**: Uses `ON CONFLICT` for efficient updates
- **Transaction Batching**: Batched transactions for better performance

### Database Structure
- **Businesses Table**: Comprehensive business data with all fields from JSON
- **Categories Table**: Business categories with counts
- **Service Tables**: Service categories, options, and business relationships
- **Spatial Indexing**: GIN index on GPS coordinates for location queries

## Environment Variables

```bash
# PostgreSQL Connection
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=bizdir
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_SSL=false

# Processing Limits
BUSINESS_LIMIT=1000  # Optional: limit number of businesses to process
```

## Usage

### Basic Usage
```bash
npm run sync-postgresql
```

### With Memory Optimization
```bash
node --max-old-space-size=4096 --expose-gc scripts/sync-postgresql.js
```

### With Business Limit
```bash
BUSINESS_LIMIT=1000 npm run sync-postgresql
```

## Database Schema

### Businesses Table
```sql
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  data_id VARCHAR(255) UNIQUE NOT NULL,
  place_id VARCHAR(255),
  data_cid BIGINT,
  title VARCHAR(500) NOT NULL,
  url VARCHAR(255) UNIQUE,
  provider_id VARCHAR(255),
  rating DECIMAL(3,1),
  reviews INTEGER,
  type VARCHAR(255),
  types TEXT[],
  address TEXT,
  open_state VARCHAR(255),
  operating_hours JSONB,
  phone VARCHAR(100),
  website TEXT,
  description JSONB,
  thumbnail TEXT,
  street VARCHAR(500),
  city VARCHAR(255),
  state VARCHAR(255),
  zip_code VARCHAR(20),
  country VARCHAR(10),
  reviews_per_1 INTEGER DEFAULT 0,
  reviews_per_2 INTEGER DEFAULT 0,
  reviews_per_3 INTEGER DEFAULT 0,
  reviews_per_4 INTEGER DEFAULT 0,
  reviews_per_5 INTEGER DEFAULT 0,
  photo_count INTEGER DEFAULT 0,
  logo TEXT,
  owner VARCHAR(255),
  category VARCHAR(255),
  place_url TEXT,
  note_from_owner TEXT,
  description_arr TEXT,
  not_claimed BOOLEAN DEFAULT false,
  reviews_link TEXT,
  email TEXT[],
  social_media_links TEXT[],
  facebook TEXT,
  twitter TEXT,
  instagram TEXT,
  linkedin TEXT,
  youtube TEXT,
  pinterest TEXT,
  tumblr TEXT,
  reddit TEXT,
  snapchat TEXT,
  quora TEXT,
  flickr TEXT,
  vimeo TEXT,
  medium TEXT,
  soundcloud TEXT,
  tiktok TEXT,
  mix TEXT,
  vk TEXT,
  meetup TEXT,
  operation_state VARCHAR(50),
  full_description TEXT,
  price VARCHAR(100),
  query VARCHAR(255),
  location VARCHAR(255),
  start INTEGER DEFAULT 0,
  language VARCHAR(10) DEFAULT 'en',
  location_name VARCHAR(255),
  gps_coordinates JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
```sql
CREATE INDEX idx_businesses_data_id ON businesses(data_id);
CREATE INDEX idx_businesses_place_id ON businesses(place_id);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_rating ON businesses(rating);
CREATE INDEX idx_businesses_created_at ON businesses(created_at);
CREATE INDEX idx_businesses_gps_coordinates ON businesses USING GIN(gps_coordinates);
```

## Performance Features

### Connection Pool Settings
- **Max Connections**: 20 concurrent connections
- **Idle Timeout**: 30 seconds
- **Connection Timeout**: 2 seconds
- **Max Uses**: 7500 queries per connection
- **SSL Support**: Configurable SSL connections

### Batch Processing
- **Default Batch Size**: 1000 records
- **Transaction Batching**: Automatic transaction management
- **Error Handling**: Continues processing on individual record errors
- **Memory Management**: Automatic garbage collection

### Data Processing
- **Streaming JSON**: Processes large files without memory issues
- **URL Generation**: Automatic unique URL generation for businesses
- **Category Tracking**: Automatic category counting and management
- **Service Data**: Processes service options and categories
- **GPS Coordinates**: JSONB storage for location data

## Error Handling

- **Connection Errors**: Automatic retry with connection pool
- **Data Errors**: Continues processing, logs errors
- **Memory Errors**: Graceful shutdown with cleanup
- **Network Errors**: Retry logic for data fetching

## Monitoring

The script provides detailed logging:
- Processing progress every 1000 records
- Error messages with context
- Final statistics
- Memory usage tracking

## Comparison with SQLite

### Advantages of PostgreSQL
- **Better Performance**: Optimized for large datasets
- **Advanced Indexing**: GIN indexes for JSON data
- **Concurrent Access**: Multiple connections supported
- **Data Integrity**: ACID compliance
- **Scalability**: Handles millions of records efficiently

### Memory Usage
- **SQLite**: Loads entire dataset into memory
- **PostgreSQL**: Streaming processing, minimal memory usage

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   ```bash
   # Increase connection timeout
   export POSTGRES_CONNECTION_TIMEOUT=5000
   ```

2. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   node --max-old-space-size=8192 scripts/sync-postgresql.js
   ```

3. **Batch Size Issues**
   ```bash
   # Reduce batch size for slower systems
   # Edit BATCH_SIZE in script
   ```

### Performance Tuning

1. **Database Configuration**
   ```sql
   -- Increase shared buffers
   ALTER SYSTEM SET shared_buffers = '256MB';
   
   -- Increase work memory
   ALTER SYSTEM SET work_mem = '16MB';
   
   -- Restart PostgreSQL
   ```

2. **Index Optimization**
   ```sql
   -- Analyze table for better query planning
   ANALYZE businesses;
   ```

## Dependencies

```json
{
  "pg": "^8.11.3",
  "pg-copy-streams": "^6.0.0",
  "stream-chain": "^3.4.0",
  "stream-json": "^1.9.1"
}
```

## Installation

```bash
npm install pg pg-copy-streams stream-chain stream-json
```

## Security Considerations

- Use environment variables for database credentials
- Enable SSL for production connections
- Implement proper access controls
- Regular database backups
- Monitor connection usage

## Future Enhancements

- **Parallel Processing**: Multi-threaded data processing
- **Incremental Updates**: Only process changed records
- **Data Validation**: Schema validation before insertion
- **Monitoring Dashboard**: Real-time processing metrics
- **Backup Integration**: Automatic backup before sync 
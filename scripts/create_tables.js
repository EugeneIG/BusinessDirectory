const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// PostgreSQL connection configuration
const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

async function createTables() {
  const client = new Client(config);
  
  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('Checking existing tables...');
    
    // Check each table individually
    const tableNames = ['businesses', 'categories', 'service_categories', 'service_options', 'business_service_options'];
    const existingTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY($1)
    `, [tableNames]);

    const existingTableNames = existingTables.rows.map(row => row.table_name);
    const missingTables = tableNames.filter(table => !existingTableNames.includes(table));
    
    if (existingTableNames.length > 0) {
      console.log('The following tables already exist:');
      existingTableNames.forEach(table => console.log(`- ${table}`));
    }
    
    if (missingTables.length > 0) {
      console.log('\nThe following tables will be created:');
      missingTables.forEach(table => console.log(`- ${table}`));
      console.log('\nCreating missing tables...');
    } else {
      console.log('\nAll tables already exist. No action needed.');
      return;
    }

    // Create businesses table if missing
    if (missingTables.includes('businesses')) {
      await client.query(`
        CREATE TABLE businesses (
          title TEXT NULL,
          place_id TEXT NULL,
          data_id VARCHAR(255) NOT NULL,
          data_cid TEXT NULL,
          gps_coordinates TEXT NULL,
          provider_id TEXT NULL,
          rating TEXT NULL,
          reviews TEXT NULL,
          "type" TEXT NULL,
          "types" TEXT NULL,
          address TEXT NULL,
          open_state TEXT NULL,
          operating_hours TEXT NULL,
          phone TEXT NULL,
          website TEXT NULL,
          description TEXT NULL,
          thumbnail TEXT NULL,
          street TEXT NULL,
          city TEXT NULL,
          country TEXT NULL,
          reviews_per_1 TEXT NULL,
          reviews_per_2 TEXT NULL,
          reviews_per_3 TEXT NULL,
          reviews_per_4 TEXT NULL,
          reviews_per_5 TEXT NULL,
          photo_count TEXT NULL,
          logo TEXT NULL,
          "owner" TEXT NULL,
          category TEXT NULL,
          service_option TEXT NULL,
          place_url TEXT NULL,
          note_from_owner TEXT NULL,
          description_arr TEXT NULL,
          state TEXT NULL,
          zip_code TEXT NULL,
          not_claimed TEXT NULL,
          reviews_link TEXT NULL,
          email TEXT NULL,
          social_media_links TEXT NULL,
          facebook TEXT NULL,
          twitter TEXT NULL,
          instagram TEXT NULL,
          linkedin TEXT NULL,
          youtube TEXT NULL,
          pinterest TEXT NULL,
          tumblr TEXT NULL,
          reddit TEXT NULL,
          snapchat TEXT NULL,
          quora TEXT NULL,
          flickr TEXT NULL,
          vimeo TEXT NULL,
          medium TEXT NULL,
          soundcloud TEXT NULL,
          tiktok TEXT NULL,
          mix TEXT NULL,
          vk TEXT NULL,
          meetup TEXT NULL,
          operation_state TEXT NULL,
          full_description TEXT NULL,
          price TEXT NULL,
          query TEXT NULL,
          "location" TEXT NULL,
          "start" TEXT NULL,
          "language" TEXT NULL,
          location_name TEXT NULL,
          url TEXT NULL,
          CONSTRAINT businesses_pkey PRIMARY KEY (data_id)
        )
      `);
      console.log('✓ Businesses table created');
    }

    // Create categories table if missing
    if (missingTables.includes('categories')) {
      await client.query(`
        CREATE TABLE categories (
          category_id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          url VARCHAR(255) UNIQUE NOT NULL,
          count INTEGER DEFAULT 0,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ Categories table created');
    }

    // Create service_categories table if missing
    if (missingTables.includes('service_categories')) {
      await client.query(`
        CREATE TABLE service_categories (
          category_id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ Service categories table created');
    }

    // Create service_options table if missing
    if (missingTables.includes('service_options')) {
      await client.query(`
        CREATE TABLE service_options (
          option_id VARCHAR(50) PRIMARY KEY,
          category_id VARCHAR(50) NOT NULL,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          business_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES service_categories(category_id) ON DELETE CASCADE
        )
      `);
      console.log('✓ Service options table created');
    }

    // Create business_service_options junction table if missing
    if (missingTables.includes('business_service_options')) {
      await client.query(`
        CREATE TABLE business_service_options (
          business_id VARCHAR(255) NOT NULL,
          option_id VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (business_id, option_id),
          FOREIGN KEY (option_id) REFERENCES service_options(option_id) ON DELETE CASCADE
        )
      `);
      console.log('✓ Business service options table created');
    }

    // Create indexes for better performance
    console.log('Creating indexes...');

    // Check existing indexes
    const existingIndexes = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname IN (
        'idx_categories_name', 'idx_categories_url',
        'idx_service_categories_slug',
        'idx_service_options_category_id', 'idx_service_options_slug',
        'idx_business_service_options_business_id', 'idx_business_service_options_option_id'
      )
    `);

    const existingIndexNames = existingIndexes.rows.map(row => row.indexname);

    // Categories indexes
    if (!existingIndexNames.includes('idx_categories_name') && missingTables.includes('categories')) {
      await client.query(`CREATE INDEX idx_categories_name ON categories(name)`);
      console.log('✓ Categories name index created');
    }
    if (!existingIndexNames.includes('idx_categories_url') && missingTables.includes('categories')) {
      await client.query(`CREATE INDEX idx_categories_url ON categories(url)`);
      console.log('✓ Categories url index created');
    }

    // Service categories indexes
    if (!existingIndexNames.includes('idx_service_categories_slug') && missingTables.includes('service_categories')) {
      await client.query(`CREATE INDEX idx_service_categories_slug ON service_categories(slug)`);
      console.log('✓ Service categories slug index created');
    }

    // Service options indexes
    if (!existingIndexNames.includes('idx_service_options_category_id') && missingTables.includes('service_options')) {
      await client.query(`CREATE INDEX idx_service_options_category_id ON service_options(category_id)`);
      console.log('✓ Service options category_id index created');
    }
    if (!existingIndexNames.includes('idx_service_options_slug') && missingTables.includes('service_options')) {
      await client.query(`CREATE INDEX idx_service_options_slug ON service_options(slug)`);
      console.log('✓ Service options slug index created');
    }

    // Business service options indexes
    if (!existingIndexNames.includes('idx_business_service_options_business_id') && missingTables.includes('business_service_options')) {
      await client.query(`CREATE INDEX idx_business_service_options_business_id ON business_service_options(business_id)`);
      console.log('✓ Business service options business_id index created');
    }
    if (!existingIndexNames.includes('idx_business_service_options_option_id') && missingTables.includes('business_service_options')) {
      await client.query(`CREATE INDEX idx_business_service_options_option_id ON business_service_options(option_id)`);
      console.log('✓ Business service options option_id index created');
    }

    console.log('\n🎉 Table creation completed!');
    if (missingTables.length > 0) {
      console.log('\nTables created:');
      missingTables.forEach(table => console.log(`- ${table}`));
    }
    console.log('\nAll required tables are now available.');

  } catch (error) {
    console.error('Error creating tables:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Check if required environment variables are set
function validateEnvironment() {
  const required = ['POSTGRES_HOST', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(key => console.error(`- ${key}`));
    console.error('\nPlease check your .env.local file and ensure all PostgreSQL configuration is set.');
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('PostgreSQL Table Creation Script');
  console.log('================================\n');
  
  validateEnvironment();
  await createTables();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createTables, validateEnvironment };

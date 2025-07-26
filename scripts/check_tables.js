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

async function checkTables() {
  const client = new Client(config);
  
  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!\n');

    // Check all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    if (tables.rows.length === 0) {
      console.log('No tables found in the database.');
      return;
    }

    console.log('📊 Database Tables Overview');
    console.log('===========================\n');

    for (const table of tables.rows) {
      const tableName = table.table_name;
      
      // Get table structure
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);

      // Get row count
      const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const rowCount = countResult.rows[0].count;

      console.log(`📋 Table: ${tableName}`);
      console.log(`   Rows: ${rowCount}`);
      console.log('   Columns:');
      
      columns.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultValue = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`     - ${col.column_name}: ${col.data_type} ${nullable}${defaultValue}`);
      });

      // Get indexes for this table
      const indexes = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes 
        WHERE tablename = $1 AND schemaname = 'public'
      `, [tableName]);

      if (indexes.rows.length > 0) {
        console.log('   Indexes:');
        indexes.rows.forEach(idx => {
          console.log(`     - ${idx.indexname}`);
        });
      }

      console.log('');
    }

    // Summary
    console.log('📈 Summary');
    console.log('==========');
    
    // Get counts for each table individually
    const businessCount = await client.query('SELECT COUNT(*) as count FROM businesses');
    const categoryCount = await client.query('SELECT COUNT(*) as count FROM categories');
    const serviceCategoryCount = await client.query('SELECT COUNT(*) as count FROM service_categories');
    const serviceOptionCount = await client.query('SELECT COUNT(*) as count FROM service_options');
    const businessServiceOptionCount = await client.query('SELECT COUNT(*) as count FROM business_service_options');
    
    console.log(`Businesses: ${businessCount.rows[0].count}`);
    console.log(`Categories: ${categoryCount.rows[0].count}`);
    console.log(`Service Categories: ${serviceCategoryCount.rows[0].count}`);
    console.log(`Service Options: ${serviceOptionCount.rows[0].count}`);
    console.log(`Business Service Options: ${businessServiceOptionCount.rows[0].count}`);

    // Check if all required tables exist
    const requiredTables = ['businesses', 'categories', 'service_categories', 'service_options', 'business_service_options'];
    const existingTables = tables.rows.map(row => row.table_name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log('\n⚠️  Missing tables:');
      missingTables.forEach(table => console.log(`   - ${table}`));
      console.log('\nRun "npm run create-tables" to create missing tables.');
    } else {
      console.log('\n✅ All required tables exist!');
    }

  } catch (error) {
    console.error('Error checking tables:', error.message);
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
  console.log('PostgreSQL Table Check Script');
  console.log('============================\n');
  
  validateEnvironment();
  await checkTables();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkTables, validateEnvironment }; 
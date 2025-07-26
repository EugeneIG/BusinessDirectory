const fs = require('fs');
const path = require('path');
const https = require('https');
const { Client } = require('pg');
const { chain } = require('stream-chain');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
require('dotenv').config({ path: '.env.local' });

// Helper to get data file path
function getDataFilePath() {
  return path.join(__dirname, '../data/data.json');
}

// Helper to get temp directory path
function getTempDirPath() {
  return path.join(__dirname, '../data/tmp');
}

// Add a limit parameter for testing
const BUSINESS_LIMIT = process.env.BUSINESS_LIMIT ? parseInt(process.env.BUSINESS_LIMIT) : null;

// Memory monitoring function
function logMemoryUsage() {
  const used = process.memoryUsage();
  console.log(`Memory usage: ${Math.round(used.heapUsed / 1024 / 1024)}MB heap, ${Math.round(used.rss / 1024 / 1024)}MB RSS`);
}

// Function to split large JSON file into smaller chunks
function splitJsonFile(inputFilePath, outputDir, maxSizeMB = 5) {
  console.log(`Splitting large JSON file into ${maxSizeMB}MB chunks...`);
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const chunkFiles = [];
  let currentChunk = [];
  let currentSize = 0;
  let chunkIndex = 1;
  
  // Read the file in chunks to avoid memory issues
  const fileStream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });
  const jsonParser = parser();
  const arrayStream = streamArray();
  
  return new Promise((resolve, reject) => {
    const pipeline = chain([
      fileStream,
      jsonParser,
      arrayStream
    ]);
    
    pipeline.on('data', (data) => {
      const itemSize = JSON.stringify(data).length;
      
      // If adding this item would exceed the size limit, save current chunk
      if (currentSize + itemSize > maxSizeBytes && currentChunk.length > 0) {
        const chunkFilePath = path.join(outputDir, `chunk_${chunkIndex}.json`);
        const chunkData = {
          data: currentChunk
        };
        
        fs.writeFileSync(chunkFilePath, JSON.stringify(chunkData, null, 2));
        chunkFiles.push(chunkFilePath);
        console.log(`Created chunk ${chunkIndex}: ${currentChunk.length} items, ${Math.round(currentSize / 1024 / 1024)}MB`);
        
        // Reset for next chunk
        currentChunk = [];
        currentSize = 0;
        chunkIndex++;
      }
      
      currentChunk.push(data);
      currentSize += itemSize;
    });
    
    pipeline.on('end', () => {
      // Save the last chunk if it has data
      if (currentChunk.length > 0) {
        const chunkFilePath = path.join(outputDir, `chunk_${chunkIndex}.json`);
        const chunkData = {
          data: currentChunk
        };
        
        fs.writeFileSync(chunkFilePath, JSON.stringify(chunkData, null, 2));
        chunkFiles.push(chunkFilePath);
        console.log(`Created chunk ${chunkIndex}: ${currentChunk.length} items, ${Math.round(currentSize / 1024 / 1024)}MB`);
      }
      
      console.log(`Split complete: ${chunkFiles.length} chunks created`);
      resolve(chunkFiles);
    });
    
    pipeline.on('error', (error) => {
      reject(error);
    });
  });
}

// Function to process a single chunk file
async function processChunkFile(chunkFilePath) {
  console.log(`Processing chunk file: ${path.basename(chunkFilePath)}`);
  
  try {
    const fileData = JSON.parse(fs.readFileSync(chunkFilePath, 'utf8'));
    const data = fileData.data || [];
    
    console.log(`Processing ${data.length} businesses from chunk...`);
    
    const BATCH_SIZE = 100;
    let batch = [];
    let processedInChunk = 0;
    
    for (const business of data) {
      // Skip if business table schema not ready
      if (!businessTableCreated) {
        console.error('Business table schema not ready');
        process.exit(1);
      }
      
      // Handle new data structure where business data is wrapped in 'value'
      const businessData = business.value || business;
      
      // Skip records with missing data_id
      if (!businessData.data_id) {
        totalSkippedRecords++;
        continue; // Skip records without data_id
      }
      
      // Check if this record already exists
      const isExistingRecord = existingDataIds.has(businessData.data_id);
      
      if (isExistingRecord) {
        totalSkippedRecords++;
      } else {
        // Generate unique URL for business (only for new records)
        let baseUrl = slugify(businessData.title || 'business');
        let url = baseUrl;
        if (businessUrlSet.has(url)) {
          const providerId = (businessData.provider_id || '').replace(/[^a-zA-Z0-9]/g, '');
          url = providerId ? `${baseUrl}-${providerId}` : baseUrl;
          let i = 2;
          while (businessUrlSet.has(url)) {
            url = providerId ? `${baseUrl}-${providerId}-${i}` : `${baseUrl}-${i}`;
            i++;
          }
        }
        businessUrlSet.add(url);
        businessData.url = url;
        
        // Add to batch for database insertion (only new records)
        batch.push(businessData);
        totalNewRecords++;
      }
      
      // Extract category (for all records, existing and new)
      const category = businessData.category;
      if (category && !categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          count: 0,
          description: `Businesses in the ${category} category`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      if (category) {
        categoryMap.get(category).count++;
      }
      
      // Process service data (for all records, existing and new)
      processServiceData(businessData);
      processedInChunk++;
      
      // Process batch when it reaches the size limit
      if (batch.length >= BATCH_SIZE) {
        await insertBusinessesToDb(batch);
        totalProcessed += batch.length;
        console.log(`Processed ${totalProcessed} new businesses (batch ${Math.ceil(totalProcessed / BATCH_SIZE)})...`);
        
        // Clear batch and reset counter
        batch = [];
        
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
        
        // Log memory usage every 10 batches
        if (Math.ceil(totalProcessed / BATCH_SIZE) % 10 === 0) {
          logMemoryUsage();
        }
        
        // Check if we've reached the limit
        if (BUSINESS_LIMIT && totalProcessed >= BUSINESS_LIMIT) {
          return true; // Signal to stop processing
        }
      }
    }
    
    if (batch.length > 0) {
      await insertBusinessesToDb(batch);
      totalProcessed += batch.length;
      console.log(`Processed ${totalProcessed} businesses (final batch of chunk)...`);
    }
    
    console.log(`Completed processing chunk: ${processedInChunk} businesses processed`);
    return false; // Continue processing more chunks
    
  } catch (error) {
    console.error(`Error processing chunk file ${chunkFilePath}:`, error);
    throw error;
  }
}

// Function to cleanup temporary chunk files
function cleanupChunkFiles(chunkFiles) {
  console.log('Cleaning up temporary chunk files...');
  for (const chunkFile of chunkFiles) {
    try {
      if (fs.existsSync(chunkFile)) {
        fs.unlinkSync(chunkFile);
        console.log(`Deleted: ${path.basename(chunkFile)}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not delete ${chunkFile}:`, error.message);
    }
  }
  
  // Try to remove the tmp directory if it's empty
  const tmpDir = getTempDirPath();
  try {
    if (fs.existsSync(tmpDir)) {
      const files = fs.readdirSync(tmpDir);
      if (files.length === 0) {
        fs.rmdirSync(tmpDir);
        console.log('Removed empty tmp directory');
      }
    }
  } catch (error) {
    console.warn('Warning: Could not remove tmp directory:', error.message);
  }
}

// Global variables for tracking
const categoryMap = new Map();
const businessUrlSet = new Set();
const serviceCategories = new Map();
const serviceOptions = new Map();
const businessServiceOptions = new Map();
let totalProcessed = 0;
let totalNewRecords = 0;
let totalSkippedRecords = 0;
let businessKeys;
let businessTableCreated = false;
let client;
let existingDataIds = new Set();

// PostgreSQL connection configuration
const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

// Helper to slugify a string
function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

// PostgreSQL Database operations
class PostgreSQLDatabase {
  constructor() {
    this.client = new Client(config);
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  async execute(sql, params = []) {
    try {
      const result = await this.client.query(sql, params);
      return { success: true, result };
    } catch (error) {
      throw new Error(`PostgreSQL execute error: ${error.message}`);
    }
  }

  async batch(statements) {
    try {
      const results = [];
      for (const statement of statements) {
        try {
          const result = await this.client.query(statement.sql, statement.params);
          results.push({ success: true, result });
        } catch (error) {
          results.push({ success: false, error: error.message });
        }
      }
      return { success: true, results };
    } catch (error) {
      throw new Error(`PostgreSQL batch error: ${error.message}`);
    }
  }

  async batchInsert(table, columns, values) {
    if (values.length === 0) return;
    
    // Process in smaller chunks to avoid memory issues
    const CHUNK_SIZE = 50;
    for (let i = 0; i < values.length; i += CHUNK_SIZE) {
      const chunk = values.slice(i, i + CHUNK_SIZE);
      
      const placeholders = chunk.map((_, rowIndex) => {
        const rowPlaceholders = columns.map((_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`).join(', ');
        return `(${rowPlaceholders})`;
      }).join(', ');

      const sql = `
        INSERT INTO "${table}" (${columns.map(col => `"${col}"`).join(', ')}) 
        VALUES ${placeholders}
        ON CONFLICT (data_id) DO UPDATE SET
        ${columns.filter(col => col !== 'data_id').map(col => `"${col}" = EXCLUDED."${col}"`).join(', ')}
      `;

      const flatValues = chunk.flatMap(row => 
        columns.map(col => {
          const value = row[col];
          if (value === null || value === undefined) return null;
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        })
      );

      try {
        await this.client.query(sql, flatValues);
      } catch (error) {
        throw new Error(`PostgreSQL batch insert error: ${error.message}`);
      }
      
      // Clear chunk from memory
      chunk.length = 0;
    }
  }
}

const db = new PostgreSQLDatabase();

async function checkTablesExist() {
  console.log('Checking if required tables exist...');
  
  // Check if required tables exist
  const existingTables = await db.execute(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('businesses', 'categories', 'service_categories', 'service_options', 'business_service_options')
  `);
  
  const existingTableNames = existingTables.result.rows.map(row => row.table_name);
  const requiredTables = ['businesses', 'categories', 'service_categories', 'service_options', 'business_service_options'];
  const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));
  
  if (missingTables.length > 0) {
    console.error('Missing required tables:');
    missingTables.forEach(table => console.error(`- ${table}`));
    console.error('\nPlease run "pnpm run create-tables" to create the required tables first.');
    process.exit(1);
  }
  
  console.log('✅ All required tables exist');
  console.log('Found tables:', existingTableNames.join(', '));
}

async function getBusinessTableSchema() {
  console.log('Getting business table schema...');
  
  // Get the column information from the existing businesses table
  const columns = await db.execute(`
    SELECT column_name, data_type
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'businesses'
    ORDER BY ordinal_position
  `);
  
  businessKeys = columns.result.rows.map(row => row.column_name);
  
  if (!businessKeys.includes('data_id')) {
    console.error('data_id column not found in businesses table');
    process.exit(1);
  }
  
  // Ensure 'url' is always included
  if (!businessKeys.includes('url')) {
    businessKeys.push('url');
  }
  
  console.log(`Found ${businessKeys.length} columns in businesses table`);
  businessTableCreated = true;
}

async function insertBusinessesToDb(businesses) {
  if (businesses.length === 0) return;
  
  await db.batchInsert('businesses', businessKeys, businesses);
}

function processServiceData(business) {
  if (business.service_option && Array.isArray(business.service_option)) {
    business.service_option.forEach((category) => {
      // Create service category
      const categorySlug = category.slug;
      if (!serviceCategories.has(categorySlug)) {
        // We'll assign the category_id later when we sync with the database
        serviceCategories.set(categorySlug, {
          category_id: null, // Will be assigned during sync
          name: category.name,
          slug: category.slug,
          description: `Services in the ${category.name} category`,
          created_at: new Date().toISOString()
        });
      }

      // Process options in this category
      if (category.options && Array.isArray(category.options)) {
        category.options.forEach((option) => {
          const optionSlug = option.slug;
          if (!serviceOptions.has(optionSlug)) {
            const optionId = `so_${serviceOptions.size + 1}`;
            serviceOptions.set(optionSlug, {
              option_id: optionId,
              category_id: null, // Will be updated after category sync
              category_slug: categorySlug, // Store the slug to link later
              name: option.name,
              slug: option.slug,
              business_count: 0,
              created_at: new Date().toISOString()
            });
          }

          // Link business to this service option
          const optionId = serviceOptions.get(optionSlug).option_id;
          const businessKey = `${business.data_id}_${optionId}`;
          if (!businessServiceOptions.has(businessKey)) {
            businessServiceOptions.set(businessKey, {
              business_id: business.data_id,
              option_id: optionId,
              created_at: new Date().toISOString()
            });
          }
        });
      }
    });
  }
}

async function syncCategories() {
  const categories = Array.from(categoryMap.values());
  
  // Get existing categories to avoid URL conflicts
  const existingCategories = await db.execute(`
    SELECT category_id, name, url FROM categories
  `);
  
  const existingCategoryMap = new Map();
  existingCategories.result.rows.forEach(row => {
    existingCategoryMap.set(row.name, row);
  });
  
  const categoryUrlSet = new Set();
  
  categories.forEach((category) => {
    // Check if category already exists
    const existing = existingCategoryMap.get(category.name);
    if (existing) {
      category.category_id = existing.category_id;
      category.url = existing.url;
      return;
    }
    
    // Generate new URL for new category
    let baseUrl = slugify(category.name || 'category');
    let url = baseUrl;
    let i = 2;
    while (categoryUrlSet.has(url)) {
      url = `${baseUrl}-${i}`;
      i++;
    }
    categoryUrlSet.add(url);
    category.url = url;
  });
  
  // Assign IDs to new categories
  let newCategoryIndex = 1;
  categories.forEach((category) => {
    if (!category.category_id) {
      category.category_id = `cat_${newCategoryIndex++}`;
    }
  });
  
  if (categories.length > 0) {
    const categoryValues = categories.map(category => [
      category.category_id,
      category.name,
      category.url,
      category.count,
      category.description,
      category.created_at,
      category.updated_at
    ]);

    const placeholders = categories.map((_, index) => {
      const start = index * 7;
      return `($${start + 1}, $${start + 2}, $${start + 3}, $${start + 4}, $${start + 5}, $${start + 6}, $${start + 7})`;
    }).join(', ');

    const sql = `
      INSERT INTO categories 
      (category_id, name, url, count, description, created_at, updated_at) 
      VALUES ${placeholders}
      ON CONFLICT (category_id) DO NOTHING
    `;

    const flatValues = categoryValues.flat();
    await db.execute(sql, flatValues);
  }
  
  console.log(`Synced ${categories.length} categories to PostgreSQL database`);
  console.log('Categories created:', categories.map(c => `${c.name} (${c.count} businesses)`));
}

async function syncServiceTables() {
  // Count businesses for each service option
  serviceOptions.forEach((option) => {
    let count = 0;
    businessServiceOptions.forEach((link) => {
      if (link.option_id === option.option_id) {
        count++;
      }
    });
    option.business_count = count;
  });

  // Get existing service categories to avoid conflicts
  const existingServiceCategories = await db.execute(`
    SELECT category_id, name, slug FROM service_categories
  `);
  
  const existingServiceCategoryMap = new Map();
  existingServiceCategories.result.rows.forEach(row => {
    existingServiceCategoryMap.set(row.slug, row);
  });

  // Update existing service categories with existing IDs and assign new IDs to new categories
  let newCategoryIndex = 1;
  serviceCategories.forEach((category) => {
    const existing = existingServiceCategoryMap.get(category.slug);
    if (existing) {
      category.category_id = existing.category_id;
    } else {
      // Generate new ID for new category
      category.category_id = `sc_${newCategoryIndex++}`;
    }
  });

  // Insert service categories
  if (serviceCategories.size > 0) {
    console.log(`Inserting ${serviceCategories.size} service categories...`);
    const categoryValues = Array.from(serviceCategories.values()).map(category => [
      category.category_id,
      category.name,
      category.slug,
      category.description,
      category.created_at
    ]);

    const placeholders = categoryValues.map((_, index) => {
      const start = index * 5;
      return `($${start + 1}, $${start + 2}, $${start + 3}, $${start + 4}, $${start + 5})`;
    }).join(', ');

    const sql = `
      INSERT INTO service_categories 
      (category_id, name, slug, description, created_at) 
      VALUES ${placeholders}
      ON CONFLICT (category_id) DO NOTHING
    `;

    const flatValues = categoryValues.flat();
    await db.execute(sql, flatValues);
    console.log('Service categories inserted successfully');
  }

  // Update service options with proper category IDs
  serviceOptions.forEach((option) => {
    if (option.category_slug) {
      const category = serviceCategories.get(option.category_slug);
      if (category && category.category_id) {
        option.category_id = category.category_id;
      }
    }
  });

  // Insert service options
  if (serviceOptions.size > 0) {
    console.log(`Inserting ${serviceOptions.size} service options...`);
    
    // Debug: Print first few service options to see their category_ids
    const firstFewOptions = Array.from(serviceOptions.values()).slice(0, 5);
    console.log('First few service options:');
    firstFewOptions.forEach(option => {
      console.log(`- ${option.name} (category_id: ${option.category_id})`);
    });
    
    const optionValues = Array.from(serviceOptions.values()).map(option => [
      option.option_id,
      option.category_id,
      option.name,
      option.slug,
      option.business_count,
      option.created_at
    ]);

    const placeholders = optionValues.map((_, index) => {
      const start = index * 6;
      return `($${start + 1}, $${start + 2}, $${start + 3}, $${start + 4}, $${start + 5}, $${start + 6})`;
    }).join(', ');

    const sql = `
      INSERT INTO service_options 
      (option_id, category_id, name, slug, business_count, created_at) 
      VALUES ${placeholders}
      ON CONFLICT (option_id) DO NOTHING
    `;

    const flatValues = optionValues.flat();
    await db.execute(sql, flatValues);
    console.log('Service options inserted successfully');
  }

  // Insert business service options
  if (businessServiceOptions.size > 0) {
    console.log(`Inserting ${businessServiceOptions.size} business service options...`);
    
    // Process in smaller chunks to avoid parameter binding issues
    const CHUNK_SIZE = 50; // Reduced chunk size
    const businessOptionValues = Array.from(businessServiceOptions.values());
    let processedCount = 0;
    
    for (let i = 0; i < businessOptionValues.length; i += CHUNK_SIZE) {
      const chunk = businessOptionValues.slice(i, i + CHUNK_SIZE);
      const chunkValues = chunk.map(link => [
        link.business_id,
        link.option_id,
        link.created_at
      ]);

      const placeholders = chunkValues.map((_, index) => {
        const start = index * 3;
        return `($${start + 1}, $${start + 2}, $${start + 3})`;
      }).join(', ');

      const sql = `
        INSERT INTO business_service_options 
        (business_id, option_id, created_at) 
        VALUES ${placeholders}
        ON CONFLICT (business_id, option_id) DO NOTHING
      `;

      const flatValues = chunkValues.flat();
      await db.execute(sql, flatValues);
      
      processedCount += chunk.length;
      if (processedCount % 1000 === 0) {
        console.log(`Processed ${processedCount}/${businessServiceOptions.size} business service options...`);
      }
    }
    
    console.log('Business service options inserted successfully');
  }

  console.log('Service tables synced successfully!');
  console.log(`Service Categories: ${serviceCategories.size}`);
  console.log(`Service Options: ${serviceOptions.size}`);
  console.log(`Business Service Options: ${businessServiceOptions.size}`);

  // Print summary
  console.log('\nService Categories:');
  serviceCategories.forEach((category) => {
    console.log(`- ${category.name} (${category.slug})`);
  });

  console.log('\nTop Service Options:');
  const sortedOptions = Array.from(serviceOptions.values()).sort((a, b) => b.business_count - a.business_count);
  sortedOptions.slice(0, 10).forEach((option) => {
    console.log(`- ${option.name}: ${option.business_count} businesses`);
  });
}

async function loadExistingDataIds() {
  console.log('Loading existing data_ids from database...');
  
  try {
    const result = await db.execute(`
      SELECT data_id FROM businesses
    `);
    
    existingDataIds = new Set(result.result.rows.map(row => row.data_id));
    console.log(`Found ${existingDataIds.size} existing records in database`);
    
  } catch (error) {
    console.error('Error loading existing data_ids:', error);
    // If table doesn't exist or is empty, continue with empty set
    existingDataIds = new Set();
  }
}

async function main() {
  try {
    console.log('Starting PostgreSQL sync with local file processing...');
    
    // Connect to PostgreSQL
    await db.connect();
    console.log('Connected to PostgreSQL database');
    
    await checkTablesExist();
    await getBusinessTableSchema();
    
    // Load existing data_ids to check for duplicates
    await loadExistingDataIds();
    
    const inputFilePath = getDataFilePath();
    const outputDir = getTempDirPath();
    
    // Check if the file is too large to read at once
    const stats = fs.statSync(inputFilePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    console.log(`Input file size: ${fileSizeMB.toFixed(2)}MB`);
    
    let chunkFiles = [];
    
    // If file is larger than 100MB, split it into chunks
    if (fileSizeMB > 100) {
      console.log('File is large, splitting into chunks...');
      chunkFiles = await splitJsonFile(inputFilePath, outputDir);
    } else {
      // Try to read the file directly
      try {
        console.log('Attempting to read file directly...');
        const fileData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
        // Handle both direct array and wrapped data structure
        const data = Array.isArray(fileData) ? fileData : (fileData.data || []);
        
        // Create temp directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Create a single chunk file for processing
        const singleChunkPath = path.join(outputDir, 'single_chunk.json');
        fs.writeFileSync(singleChunkPath, JSON.stringify({ data }, null, 2));
        chunkFiles = [singleChunkPath];
        
      } catch (error) {
        if (error.code === 'ERR_STRING_TOO_LONG') {
          console.log('File too large to read directly, splitting into chunks...');
          chunkFiles = await splitJsonFile(inputFilePath, outputDir);
        } else {
          throw error;
        }
      }
    }
    
    // Process each chunk file
    for (const chunkFile of chunkFiles) {
      const stopProcessing = await processChunkFile(chunkFile);
      if (stopProcessing) {
        break; // Stop processing if limit is reached
      }
    }
    
    await syncCategories();
    await syncServiceTables();
    console.log('Synced data from file to PostgreSQL database with data_id as PRIMARY KEY');
    console.log(`Total businesses processed: ${totalProcessed}`);
    console.log(`New records added: ${totalNewRecords}`);
    console.log(`Skipped existing records: ${totalSkippedRecords}`);
    
    // Cleanup temporary files
    cleanupChunkFiles(chunkFiles);
    
    await db.disconnect();
    
  } catch (error) {
    console.error('Error during sync:', error);
    if (db) {
      await db.disconnect();
    }
    process.exit(1);
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
if (require.main === module) {
  validateEnvironment();
  main().catch(console.error);
}

module.exports = { main, validateEnvironment };

const fs = require('fs');
const path = require('path');

function createEnvFile() {
  const envPath = path.join(__dirname, '../.env.local');
  
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file already exists');
    return;
  }

  const envContent = `# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=bizdir
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_SSL=false

# Processing Configuration
BUSINESS_LIMIT=1000

# Node.js Memory Configuration
# NODE_OPTIONS=--max-old-space-size=4096 --expose-gc
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with default PostgreSQL configuration');
    console.log('📝 Please update the database credentials as needed');
  } catch (error) {
    console.error('❌ Error creating .env.local file:', error.message);
  }
}

function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['pg', 'pg-copy-streams', 'stream-chain', 'stream-json'];
  const missingDeps = [];

  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      missingDeps.push(dep);
    }
  });

  if (missingDeps.length > 0) {
    console.log('❌ Missing dependencies:');
    missingDeps.forEach(dep => console.log(`   - ${dep}`));
    console.log('\n📦 Run: npm install');
  } else {
    console.log('✅ All required dependencies are installed');
  }
}

function checkDataFiles() {
  const dataDir = path.join(__dirname, '../data');
  const requiredFiles = ['sd.json', 'data.txt'];
  
  console.log('\n📁 Checking data files:');
  
  requiredFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });
}

function showInstructions() {
  console.log('\n🚀 PostgreSQL Sync Setup Instructions:');
  console.log('\n1. Install dependencies:');
  console.log('   npm install');
  
  console.log('\n2. Set up PostgreSQL database:');
  console.log('   - Install PostgreSQL');
  console.log('   - Create database: CREATE DATABASE bizdir;');
  console.log('   - Update .env.local with your credentials');
  
  console.log('\n3. Test JSON structure:');
  console.log('   npm run test-json');
  
  console.log('\n4. Run PostgreSQL sync:');
  console.log('   npm run sync-postgresql');
  
  console.log('\n5. For large datasets, increase memory:');
  console.log('   node --max-old-space-size=8192 scripts/sync-postgresql.js');
  
  console.log('\n📚 For more information, see: scripts/README-postgresql-sync.md');
}

function main() {
  console.log('🔧 PostgreSQL Sync Setup\n');
  
  createEnvFile();
  checkDependencies();
  checkDataFiles();
  showInstructions();
}

main(); 
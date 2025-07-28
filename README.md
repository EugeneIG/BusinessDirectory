# BusinessDirectory

![BusinessDirectory](/BusinessDirectory.png)

A modern, open-source business directory platform built with Next.js, TypeScript, and Tailwind CSS. Deploy to Cloudflare Workers for global performance and scalability.

**Based on Geoscraper** - This project is based on Geoscraper, a Google Maps scraper, and has been adapted into a business directory platform.

![BusinessDirectory](https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-4.26.0-F38020?style=for-the-badge&logo=cloudflare)

## 🌟 Features

- **Modern UI/UX** - Beautiful, responsive design
- **Search & Filter** - Advanced search with category and location filtering
- **Business Profiles** - Detailed business listings with reviews and ratings
- **Category Management** - Organized business categories and subcategories
- **SEO Optimized** - Built-in SEO features for better search engine visibility
- **Cloudflare Workers** - Deploy globally with edge computing
- **Multiple Database Options** - PostgreSQL, D1, or SQLite support
- **Fully Configurable** - Easy customization for any business type
- **Open Source** - MIT licensed, community-driven development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Cloudflare account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chamuditha4/BusinessDirectory.git
   cd BusinessDirectory
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your database** (see Database Setup section)

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

BusinessDirectory supports multiple database options. Choose the one that best fits your needs:

### Option 1: PostgreSQL (Recommended)

**Best for:** Production applications with complex queries and large datasets

1. **Set up PostgreSQL database**
   - [Supabase](https://supabase.com) (recommended)
   - [Neon](https://neon.tech)
   - [Railway](https://railway.app)
   - Self-hosted PostgreSQL

2. **Configure environment variables**
   ```env
   POSTGRES_HOST=your-postgres-host.com
   POSTGRES_PORT=5432
   POSTGRES_DB=your-database-name
   POSTGRES_USER=your-username
   POSTGRES_PASSWORD=your-password
   POSTGRES_SSL=true
   ```

3. **Sync your data**
   ```bash
   pnpm run sync-postgresql
   ```

## ⚙️ Configuration

BusinessDirectory is highly configurable. All settings are managed through the configuration system.

### Basic Configuration

Edit `lib/config.ts` to customize your business directory:

```typescript
export const config = {
  business: {
    name: "Your Business Directory",
    tagline: "Discover Local Businesses",
    description: "Find the best local businesses in your area",
    logo: {
      icon: "MapPin",
      text: "YourBusiness"
    },
    contact: {
      email: "contact@yourbusiness.com",
      phone: "+1 (555) 123-4567",
      address: "Your address"
    }
  },
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#F59E0B"
  },
  navigation: {
    main: [
      { href: "/", label: "Home" },
      { href: "/businesses", label: "Browse" },
      { href: "/categories", label: "Categories" }
    ]
  }
}
```

### Available Configurations

The project includes several pre-built configurations:

- **Default Business Directory** - General business listings
- **Restaurant Directory** - Food and dining focused
- **Service Provider Directory** - Professional services
- **Real Estate Directory** - Property listings

### Customizing Colors

Update colors in your configuration:

```typescript
colors: {
  primary: "#YOUR_PRIMARY_COLOR",
  secondary: "#YOUR_SECONDARY_COLOR",
  accent: "#YOUR_ACCENT_COLOR",
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F3F4F6"
  },
  text: {
    primary: "#111827",
    secondary: "#374151",
    muted: "#6B7280"
  }
}
```

### Features Configuration

Control which features are enabled:

```typescript
features: {
  searchEnabled: true,    // Enable/disable search functionality
  categoriesEnabled: true, // Enable/disable categories
  reviewsEnabled: true    // Enable/disable reviews
}
```

## 🚀 Deployment

### Docker Deployment

BusinessDirectory includes Docker support for easy containerized deployment.

#### Quick Start with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t business-directory .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 \
     -e POSTGRES_HOST=your-postgres-host.com \
     -e POSTGRES_PORT=5432 \
     -e POSTGRES_DB=your-database-name \
     -e POSTGRES_USER=your-username \
     -e POSTGRES_PASSWORD=your-password \
     -e POSTGRES_SSL=true \
     business-directory
   ```



#### Production Docker Deployment

For production deployments:

1. **Build optimized image:**
   ```bash
   docker build -t business-directory:latest .
   ```

2. **Run with production settings:**
   ```bash
   docker run -d \
     --name business-directory \
     -p 80:3000 \
     -e NODE_ENV=production \
     -e POSTGRES_HOST=your-production-db.com \
     -e POSTGRES_PORT=5432 \
     -e POSTGRES_DB=your-database \
     -e POSTGRES_USER=your-username \
     -e POSTGRES_PASSWORD=your-password \
     -e POSTGRES_SSL=true \
     --restart unless-stopped \
     business-directory:latest
   ```

#### Docker Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `POSTGRES_HOST` | PostgreSQL host | Required |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_DB` | Database name | Required |
| `POSTGRES_USER` | Database user | Required |
| `POSTGRES_PASSWORD` | Database password | Required |
| `POSTGRES_SSL` | Use SSL connection | `true` |
| `BUSINESS_LIMIT` | Limit for testing | `null` |

#### Docker Commands Reference

```bash
# Build image
docker build -t business-directory .

# Run container
docker run -p 3000:3000 business-directory

# Run in background
docker run -d -p 3000:3000 business-directory

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Remove image
docker rmi business-directory
```

### Deploy to Cloudflare Workers

1. **Build the project**
   ```bash
   pnpm build-cloudflare
   ```

2. **Deploy to Cloudflare**
   ```bash
   pnpm deploy
   ```

### Environment Variables for Production

Add these to your Cloudflare Workers environment:

```env
# Database Configuration (choose one)
# For PostgreSQL:
POSTGRES_HOST=your-postgres-host.com
POSTGRES_PORT=5432
POSTGRES_DB=your-database-name
POSTGRES_USER=your-username
POSTGRES_PASSWORD=your-password
POSTGRES_SSL=true

# No additional environment variables needed

# Business limit for testing (optional)
BUSINESS_LIMIT=10000
```

### Wrangler Configuration

Update `wrangler.toml` for your deployment:

```toml
name = "your-business-directory"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

[placement]
mode = "smart"

# For PostgreSQL deployment
[env.production.vars]
POSTGRES_HOST="your-postgres-host.com"
POSTGRES_PORT="5432"
POSTGRES_DB="your-database-name"
POSTGRES_USER="your-username"
POSTGRES_PASSWORD="your-password"

```

## 📊 Data Management

### Obtaining Business Data

The business data for this directory can be obtained from [Geoscraper](https://geoscraper.net), a Google Maps scraping service:

1. **Visit Geoscraper Task Status:**
   - Go to https://geoscraper.net/task-status
   - Create an account or log in to your existing account

2. **Create a New Scraping Task:**
   - Set your search parameters (location, business type, etc.)
   - Start the scraping process
   - Wait for the task to complete

3. **Download and Replace Data:**
   - Once the task is finished, download the JSON file
   - Rename it to `data.json`
   - Replace the existing file in the `data/` directory of your project

4. **Sync to Database:**
   ```bash
   # Sync the new data to PostgreSQL
   pnpm run sync-postgresql
   ```

**That's it!** The sync command handles everything automatically - no manual editing required.

### Syncing Business Data

The project includes scripts to sync business data from various sources:

```bash
# Sync to PostgreSQL
pnpm run sync-postgresql

# Sync with limit for testing
BUSINESS_LIMIT=1000 pnpm run sync-postgresql
```

### Database Schema

The application automatically creates the following tables:

- **businesses** - Main business listings
- **categories** - Business categories
- **service_categories** - Service type categories
- **service_options** - Specific service options
- **business_service_options** - Business-service relationships

## 📁 Data Configuration

### Modifying Business Data

The application uses the `data/data.json` file as the primary source for business listings. This file contains an array of business objects with detailed information.

#### Data File Structure

The `data.json` file contains an array of business objects with the following structure:

```json
[
  {
    "title": "Business Name",
    "place_id": "Google Place ID",
    "data_id": "Unique data identifier",
    "gps_coordinates": {
      "latitude": 7.4780819,
      "longitude": 80.3669703
    },
    "rating": 4.4,
    "reviews": 170,
    "type": "Business Type",
    "types": ["Category1", "Category2"],
    "address": "Full address",
    "open_state": "Open/Closed status",
    "operating_hours": {
      "sunday": "9 a.m.–8 p.m.",
      "monday": "9 a.m.–8 p.m.",
      // ... other days
    },
    "phone": "+94 372 232 221",
    "website": "https://example.com",
    "description": {},
    "thumbnail": "Image URL",
    "street": "Street address",
    "city": "City name",
    "country": "Country code",
    "category": "Primary category",
    "service_option": [
      {
        "name": "Service category",
        "slug": "service_slug",
        "options": [
          {
            "name": "Service option",
            "slug": "option_slug"
          }
        ]
      }
    ],
    "place_url": "Google Maps URL",
    "note_from_owner": "Business description",
    "email": ["email@example.com"],
    "social_media_links": [],
    "facebook": "Facebook URL",
    "twitter": "Twitter URL",
    "instagram": "Instagram URL",
    "operation_state": "OPEN"
  }
]
```

#### How to Update Business Data

**Simple Method - Replace and Sync:**

1. **Replace the data.json file:**
   ```bash
   # Navigate to the data directory
   cd data
   
   # Backup current data (optional)
   cp data.json data.json.backup
   
   # Replace with new data file
   # Copy your new data.json file to this location
   ```

2. **Run the sync command:**
   ```bash
   # Sync the new data to PostgreSQL
   pnpm run sync-postgresql
   ```

That's it! The sync command will automatically:
- Process all businesses in the new data.json file
- Update existing businesses
- Add new businesses
- Remove businesses that are no longer in the file
- Handle all database operations automatically

**Alternative - Manual Editing (Advanced Users):**

If you need to make small manual changes:

1. **Edit the data.json file directly:**
   ```bash
   # Navigate to the data directory
   cd data
   
   # Edit the data.json file
   nano data.json
   # or use your preferred editor
   code data.json
   ```

2. **Run the sync command:**
   ```bash
   # Sync the updated data to PostgreSQL
   pnpm run sync-postgresql
   ```

#### Required Fields

The following fields are required for each business:

- `title` - Business name
- `place_id` - Google Place ID (unique identifier)
- `gps_coordinates` - Latitude and longitude
- `address` - Full address
- `city` - City name
- `country` - Country code
- `category` - Primary business category
- `type` - Business type

#### Optional Fields

These fields enhance the business listing but are not required:

- `rating` - Average rating (0-5)
- `reviews` - Number of reviews
- `phone` - Contact phone number
- `website` - Business website URL
- `operating_hours` - Business hours
- `open_state` - Current open/closed status
- `thumbnail` - Business image URL
- `logo` - Business logo URL
- `note_from_owner` - Business description
- `email` - Contact email addresses
- `social_media_links` - Social media URLs
- `service_option` - Available services

#### Data Validation

After modifying the `data.json` file:

1. **Validate JSON syntax:**
   ```bash
   # Check if JSON is valid
   node -e "JSON.parse(require('fs').readFileSync('data/data.json', 'utf8'))"
   ```

2. **Sync to database:**
   ```bash
   # Sync the updated data to PostgreSQL
   pnpm run sync-postgresql
   ```

3. **Test the application:**
   ```bash
   # Start the development server
   pnpm dev
   ```

#### Data Sources

The business data can come from various sources:

- **[Geoscraper](https://geoscraper.net)** - Google Maps scraping service (recommended)
- **Google Maps API** - Direct API integration
- **Manual entry** - Manually added businesses
- **CSV import** - Converted from spreadsheet data
- **API integration** - From external business directories

#### Best Practices

1. **Backup your data:**
   ```bash
   # Create a backup before making changes
   cp data/data.json data/data.json.backup
   ```

2. **Use consistent formatting:**
   - Maintain consistent address formatting
   - Use standardized phone number formats
   - Ensure GPS coordinates are accurate

3. **Validate data quality:**
   - Check for duplicate entries
   - Verify contact information
   - Ensure business categories are appropriate

4. **Test changes:**
   - Always test with a small dataset first
   - Verify the sync process works correctly
   - Check that the application displays data properly

#### Large Dataset Handling

For large datasets (10,000+ businesses):

1. **Use the limit parameter:**
   ```bash
   # Test with a smaller subset
   BUSINESS_LIMIT=1000 pnpm run sync-postgresql
   ```

2. **Split large files:**
   - The sync script automatically handles large files
   - It splits data into manageable chunks
   - Processes each chunk separately

3. **Monitor memory usage:**
   - The script includes memory monitoring
   - Adjust chunk sizes if needed
   - Use appropriate hardware resources

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm run dev              # Start development server
pnpm run build            # Build for production
pnpm run start            # Start production server

# Database
pnpm run sync-postgresql  # Sync data to PostgreSQL
pnpm run setup-postgresql # Setup PostgreSQL tables
pnpm run create-tables    # Create database tables

# Deployment
pnpm run build-cloudflare # Build for Cloudflare Workers
pnpm run deploy           # Deploy to Cloudflare
pnpm run preview          # Preview deployment

# Utilities
pnpm run lint             # Run ESLint
pnpm run check-tables     # Check database tables
```

### Project Structure

```
BusinessDirectory/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── business/       # Business detail pages
│   ├── businesses/     # Business listing pages
│   └── categories/     # Category pages
├── components/         # React components
├── lib/               # Utilities and configuration
├── data/              # Data files and scripts
├── scripts/           # Database sync scripts
├── styles/            # Global styles
└── utils/             # Helper functions
```

## 🎨 Customization

### Adding New Business Types

1. **Create a new configuration** in `lib/config.ts`
2. **Update the navigation** for your business type
3. **Customize colors** to match your brand
4. **Add relevant categories** and service options

### Styling

The project uses Tailwind CSS with custom CSS variables:

```css
:root {
  --color-primary: #3B82F6;
  --color-secondary: #8B5CF6;
  --color-accent: #F59E0B;
}
```

### Components

All components are built with Radix UI primitives and are fully customizable:

- **Business Cards** - Display business information
- **Search Filters** - Advanced filtering options
- **Category Navigation** - Browse by category
- **Review System** - Business ratings and reviews

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [CONFIGURATION.md](CONFIGURATION.md) for detailed configuration options
- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/chamuditha4/BusinessDirectory/issues)
- **Discussions**: Join the community on [GitHub Discussions](https://github.com/chamuditha4/BusinessDirectory/discussions)

## 🙏 Acknowledgments

- **[Geoscraper](https://geoscraper.net)** - Original Google Maps scraper that this project is based on
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible UI primitives
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing platform
- [Lucide React](https://lucide.dev/) - Beautiful icons

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=chamuditha4/BusinessDirectory&type=Date)](https://www.star-history.com/#chamuditha4/BusinessDirectory&Date)

**Made with ❤️ by the open-source community**

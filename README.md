# Cliento - Client Management System

A modern, full-stack client relationship management (CRM) application built with Next.js, focused on real estate buyer management. Features authentication, CRUD operations, data import/export, rate limiting, and a clean component architecture.

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **UI Library**: Ant Design 5.27.3
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Rate Limiting**: Upstash Redis
- **Styling**: CSS Modules + Tailwind CSS
- **Type Safety**: TypeScript + Zod validation
- **Testing**: Jest + React Testing Library

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account
- Upstash Redis account (for rate limiting)

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cliento"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cliento
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate deploy
   
   # Optional: Seed database with sample data
   npx prisma db seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   └── buyers/            # Buyer CRUD endpoints
│   ├── buyers/                # Buyer pages
│   ├── components/            # Reusable components
│   │   ├── BuyerActions/      # Search, filters, import/export
│   │   ├── BuyerForm/         # Create/edit buyer form
│   │   └── BuyerTable/        # Data table with pagination
│   ├── lib/                   # Utility libraries
│   │   ├── validators/        # Zod schemas
│   │   ├── supabase/         # Auth clients
│   │   └── rate-limiter.ts   # Rate limiting config
│   └── types/                 # TypeScript type definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
```

### SSR vs Client-Side Rendering

**Server-Side Rendering (SSR)**
- Initial buyer list page for better SEO and performance
- Supabase server client for authenticated data fetching
- Protected routes handled via middleware

**Client-Side Rendering**
- Interactive components (forms, filters, tables)
- Real-time search and filtering
- File uploads and dynamic content

### Ownership Enforcement

**Database Level**
- Foreign key relationships ensure data integrity
- User ID stored with each buyer record

**API Level**
- Middleware authentication checks
- User context in all API operations
- Automatic filtering by user ownership

**Component Level**
- Authenticated user context passed to components
- UI elements hidden/shown based on permissions

### Rate Limiting Design

**Why Upstash Redis**
- Serverless-friendly (no persistent connections)
- Global edge locations for low latency
- Built-in analytics and monitoring
- Scales automatically

**Rate Limiting Strategy**
- Sliding window algorithm for smooth traffic control
- Different limits for different operation types
- User-based limiting (not IP-based) for better UX
- Graceful error handling with proper HTTP status codes

### Component Organization

**Folder-per-Component Structure**
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css
├── index.ts
└── subcomponents/ (if needed)
```

**Benefits**
- Co-location of related files
- Easy imports via barrel exports
- Scalable as project grows
- Clear ownership and boundaries

## Configuration

### Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities:

- **Buyer**: Core entity with comprehensive client information
- **Enums**: City, PropertyType, Status, Timeline, Source
- **Relationships**: User ownership via foreign keys

### Authentication Flow

1. User visits protected route
2. Middleware checks Supabase session
3. Redirects to login if unauthenticated
4. Magic link authentication via Supabase
5. Session maintained across requests

### API Design

- RESTful endpoints following Next.js App Router patterns
- Consistent error handling and response formats
- Rate limiting applied to all mutation operations
- Input validation with Zod schemas
- TypeScript interfaces for type safety

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

Test files are located alongside source files with `.test.ts` or `.spec.ts` extensions.

## Nice-to-haves Progress

### Implemented
- **Tag chips with typeahead**  
  - Added typeahead support for tags, improving usability when selecting multiple tags.
- **Basic full-text search on `fullName, email, notes`**  
  - Implemented full-text search functionality across key fields for faster data discovery.

### Skipped
- **Status quick-actions (dropdown in table)**  
  - Skipped due to prioritization of search and tagging features for better usability impact.
- **Optimistic edit with rollback**  
  - Not implemented as it requires additional state management complexity.
- **File upload for a single `attachmentUrl` (optional doc)**  
  - Deferred since file handling was considered lower priority compared to search and tagging.


## API Documentation

The application provides a RESTful API for buyer management with the following endpoints:

### Rate Limiting

All mutation endpoints are protected by rate limiting:
- **Create Buyer**: 5 requests per minute
- **Update Buyer**: 10 requests per minute  
- **Import CSV**: 3 requests per 5 minutes

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 2025-09-15T10:30:00.000Z
```

### Endpoints

#### 1. Create Buyer
```http
POST /api/buyers/new
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "city": "Chandigarh",
  "propertyType": "apartment",
  "budgetMin": 50,
  "budgetMax": 80,
  "timeline": "ZERO_3M",
  "source": "Website",
  "status": "New",
  "notes": "Looking for 2-3 BHK apartment",
  "tags": ["hot-lead", "first-time-buyer"]
}
```

**Success Response (201):**
```json
{
  "ok": true,
  "message": "Buyer added successfully"
}
```

**Error Responses:**
```json
// Validation Error (400)
{
  "ok": false,
  "message": "fullName: Required; phone: Required"
}

// Rate Limit Exceeded (429)
{
  "ok": false,
  "message": "Rate limit exceeded. You can create 5 buyers per minute. Try again later."
}

// Server Error (500)
{
  "ok": false,
  "message": "Database error occurred"
}
```

#### 2. Update Buyer
```http
PUT /api/buyers/[id]
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91-9876543211",
  "city": "Mohali",
  "propertyType": "villa",
  "budgetMin": 100,
  "budgetMax": 150,
  "timeline": "THREE_6M",
  "source": "Referral",
  "status": "Qualified",
  "notes": "Updated requirements",
  "tags": ["vip-client", "high-budget"],
  "updatedAt": "2025-09-15T10:25:30.000Z"
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "buyer": {
    "id": "clm123abc",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+91-9876543211",
    "city": "Mohali",
    "propertyType": "villa",
    "budgetMin": 100,
    "budgetMax": 150,
    "timeline": "THREE_6M",
    "source": "Referral",
    "status": "Qualified",
    "notes": "Updated requirements",
    "tags": ["vip-client", "high-budget"],
    "createdAt": "2025-09-15T10:00:00.000Z",
    "updatedAt": "2025-09-15T10:25:30.000Z",
    "ownerId": "user123"
  }
}
```

**Error Responses:**
```json
// Not Found (404)
{
  "ok": false,
  "message": "Not found"
}

// Forbidden (403)
{
  "ok": false,
  "message": "Forbidden"
}

// Concurrency Conflict (409)
{
  "ok": false,
  "message": "Record changed, please refresh",
  "current": { /* current buyer data */ }
}

// Missing updatedAt (400)
{
  "ok": false,
  "message": "Missing updatedAt for concurrency check"
}
```

#### 3. Import Buyers (CSV)
```http
POST /api/buyers/import
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: CSV file with buyer data

**Expected CSV Headers:**
```csv
fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
```

**Success Response (200):**
```json
{
  "ok": true,
  "inserted": 25
}
```

**Error Responses:**
```json
// No File (400)
{
  "ok": false,
  "message": "No file"
}

// Invalid CSV (400)
{
  "ok": false,
  "message": "Invalid CSV",
  "error": "Parsing error details"
}

// Too Many Rows (400)
{
  "ok": false,
  "message": "Max 200 rows allowed",
  "count": 250
}

// Missing Headers (400)
{
  "ok": false,
  "message": "Missing headers",
  "missing": ["fullName", "phone"]
}

// Validation Errors (400)
{
  "ok": false,
  "message": "Row validation errors",
  "errors": [
    {
      "row": 2,
      "errors": ["fullName: Required", "phone: Invalid format"]
    }
  ],
  "validCount": 23
}

// Rate Limited (429)
{
  "ok": false,
  "message": "Rate limit exceeded. You can import 3 files per 5 minutes. Try again later."
}
```

#### 4. Export Buyers (CSV)
```http
GET /api/buyers/export?[filters]
```

**Query Parameters:**
- `city`: Filter by city (optional)
- `propertyType`: Filter by property type (optional)
- `status`: Filter by status (optional)
- `timeline`: Filter by timeline (optional)
- `search`: Search in name, phone, email, notes (optional)

**Success Response (200):**
```http
Content-Type: text/csv
Content-Disposition: attachment; filename=buyers.csv

fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
John Doe,john@example.com,+91-9876543210,Chandigarh,apartment,,Buy,50,80,ZERO_3M,Website,Looking for apartment,"hot-lead,first-time-buyer",New
```

**Error Response (500):**
```json
{
  "ok": false,
  "message": "Failed to export buyers"
}
```

### Frontend Pages

#### 1. Buyer List Page
```http
GET /buyers?[filters]
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `city`: Filter by city
- `propertyType`: Filter by property type
- `status`: Filter by status
- `timeline`: Filter by timeline
- `search`: Search query

**Server-Side Rendered**: Returns paginated buyer data with filters applied.

#### 2. Create Buyer Page
```http
GET /buyers/new
```

**Client-Side Rendered**: Form to create new buyer.

#### 3. Edit Buyer Page
```http
GET /buyers/[id]
```

**Server-Side Rendered**: Pre-populated form with existing buyer data.

---

Built with ❤️ for modern client management

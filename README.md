# SakuMari - Japanese Kana Flashcard App

A web application for practicing Japanese Hiragana and Katakana characters with interactive flashcards and progress tracking.

[![Web-App Test](https://github.com/sakan811/SakuMari/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/SakuMari/actions/workflows/test-app.yml)
[![E2E Test](https://github.com/sakan811/SakuMari/actions/workflows/playwright.yml/badge.svg)](https://github.com/sakan811/SakuMari/actions/workflows/playwright.yml)

## Features

- **Interactive Flashcards**: Practice Hiragana and Katakana with randomized character selection
- **Progress Tracking**: View accuracy statistics and practice history
- **Adaptive Learning**: Characters with lower accuracy appear more frequently

## Try It Live

🚀 **[https://sakumari.fukudev.org/](https://sakumari.fukudev.org/)** - No setup required!

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** ([installation guide](https://pnpm.io/installation))
- **PostgreSQL** (v14 or higher) OR **Docker** for containerized database

### Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

**Required Variables:**

```bash
# Database
POSTGRES_DB=sakumari
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_PRISMA_URL=postgresql://postgres:your_password@localhost:5432/sakumari
POSTGRES_URL_NON_POOLING=postgresql://postgres:your_password@localhost:5432/sakumari

# Authentication
AUTH_URL=http://localhost:3000
AUTH_SECRET=your_generated_secret  # Generate at https://auth-secret-gen.vercel.app/
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Optional (for pgAdmin)
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin_password

# Environment
NODE_ENV=development
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Set up OAuth consent screen: "APIs & Services" → "OAuth consent screen"
4. Fill required fields (App name, User support email, Developer contact information)
5. Create credentials: "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth client ID" → "Web application"
6. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to your `.env` file

For more details: [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

## Local Development (No Docker)

**Prerequisites**: PostgreSQL installed and running locally

```bash
# Clone and setup
git clone https://github.com/sakan811/SakuMari.git
cd SakuMari
cp .env.example .env
# Edit .env with your credentials

# Install dependencies
pnpm install

# Database setup
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm exec prisma db seed

# Start development server
pnpm run dev
```

Open <http://localhost:3000>

## Local Development (Docker Database Only)

**Prerequisites**: Docker and Docker Compose installed

Use this approach to run PostgreSQL in Docker while running the Next.js app locally.

```bash
# Clone and setup
git clone https://github.com/sakan811/SakuMari.git
cd SakuMari
cp .env.example .env
# Edit .env with your credentials (use POSTGRES_HOST=localhost for local app)

# Start database services only
docker compose up -d

# Install dependencies
pnpm install

# Database setup (runs from local machine against Docker database)
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm exec prisma db seed

# Start development server locally
pnpm run dev
```

**Database Management:**
- pgAdmin: <http://localhost:8080> (use credentials from .env)
- Direct PostgreSQL: `localhost:5432`

### Full Stack Docker Deployment

**Option 1: Build from source**
```bash
# Edit .env with your credentials (use POSTGRES_HOST=db for Docker networking)
docker compose --profile build up -d

# Database setup (run inside Docker container)
docker compose exec app-build pnpm exec prisma generate
docker compose exec app-build pnpm exec prisma migrate dev
docker compose exec app-build pnpm exec prisma db seed
```
- App runs on port 3001
- Builds from local source code
- Database setup runs inside the Docker container

**Option 2: Production deployment**
```bash
# Edit .env with your credentials (use POSTGRES_HOST=db for Docker networking)
docker compose --profile prod up -d

# Database setup (run inside Docker container)
docker compose exec app pnpm exec prisma generate
docker compose exec app pnpm exec prisma migrate dev
docker compose exec app pnpm exec prisma db seed
```
- App runs on port 3000
- Uses pre-built image
- Includes Cloudflare tunnel support
- Database setup runs inside the Docker container

**Database only:**
```bash
docker compose up -d
```
- Runs PostgreSQL and pgAdmin only
- Use for external app development (see "Local Development (Docker Database Only)" above)

## Testing

```bash
# Unit tests
pnpm test                 # Watch mode
pnpm run test:run         # Single run

# Database tests
pnpm run test:db:setup    # Setup test database
pnpm run test:db          # Run database tests

# E2E tests
pnpm run test:e2e:build   # Build for E2E testing
pnpm run test:e2e         # Run E2E tests

# All tests
make test-all             # Run all tests + cleanup
```

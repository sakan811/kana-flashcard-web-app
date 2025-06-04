# SakuMari - Japanese Kana Flashcard App

A web application for practicing Japanese Hiragana and Katakana characters with interactive flashcards and progress tracking.

[![Web-App Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml)

[![Docker CI](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-ci.yml)

## Features

- **Interactive Flashcards**: Practice Hiragana and Katakana with randomized character selection
- **Progress Tracking**: View accuracy statistics and practice history
- **Adaptive Learning**: Characters with lower accuracy appear more frequently

## Access Options

**Option 1: Vercel (Recommended)** - Try the live app with no setup required

**Option 2: Docker** - Run locally with containers  

**Option 3: Local Development** - Full development environment

## Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/sakan811/SakuMari.git
   cd SakuMari
   ```

2. **Set up environment variables**
   ```bash
   cp .env.docker.example .env.docker
   ```

3. **Edit `.env.docker`** with your credentials:
   - Generate NEXTAUTH_SECRET from [https://auth-secret-gen.vercel.app/](https://auth-secret-gen.vercel.app/)
   - Set up Google OAuth as described above
   - Use `http://localhost:3000/api/auth/callback/google` as redirect URI

4. **Run with Docker**
   ```bash
   docker compose --profile pull up -d
   ```

5. **Access the app**
   Open <http://localhost:3000> in your browser

### Option 2: Local Development

1. **Clone and setup**
   ```bash
   git clone https://github.com/sakan811/SakuMari.git
   cd SakuMari
   cp .env.local.example .env
   ```

2. **Start PostgreSQL database**
   ```bash
   docker compose up -d saku-mari-db
   ```

3. **Edit `.env`** with your credentials (same as Docker setup above)

4. **Install dependencies and setup database**
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the app**
   Open <http://localhost:3000> in your browser

## Authentication Setup Details

### Getting Google OAuth Credentials

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Navigate to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
7. Copy the generated Client ID and Client Secret

### Generating NEXTAUTH_SECRET

Visit [https://auth-secret-gen.vercel.app/](https://auth-secret-gen.vercel.app/) to generate a secure random secret for JWT encryption.

## Usage

1. **Home Page**: Choose between Hiragana or Katakana practice
2. **Flashcard Practice**: Type the romaji equivalent of the displayed character
3. **Dashboard**: View your practice statistics and character-specific accuracy
4. **Progress Tracking**: The app automatically tracks your performance and shows difficult characters more often
# SakuMari - Japanese Kana Flashcard App

A web application for practicing Japanese Hiragana and Katakana characters with interactive flashcards and progress tracking.

[![Web-App Test](https://github.com/sakan811/SakuMari/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/SakuMari/actions/workflows/test-app.yml)

[![Docker CI](https://github.com/sakan811/SakuMari/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/sakan811/SakuMari/actions/workflows/docker-ci.yml)

## Features

- **Interactive Flashcards**: Practice Hiragana and Katakana with randomized character selection
- **Progress Tracking**: View accuracy statistics and practice history
- **Adaptive Learning**: Characters with lower accuracy appear more frequently

## Try It Live

🚀 **[https://saku-mari.vercel.app/](https://saku-mari.vercel.app/)** - No setup required!

## Local Setup

### Prerequisites

For local development, you'll need Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Set up OAuth consent screen: "APIs & Services" → "OAuth consent screen"
4. Fill required fields (App name, User support email, Developer contact information)
5. Create credentials: "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth client ID" → "Web application"
6. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret
8. Generate NEXTAUTH_SECRET at [https://auth-secret-gen.vercel.app/](https://auth-secret-gen.vercel.app/)

For more details: [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

### Option 1: Docker

```bash
git clone https://github.com/sakan811/SakuMari.git
cd SakuMari
cp .env.docker.example .env.docker
# Edit .env.docker with your Google OAuth credentials and NEXTAUTH_SECRET
docker compose --profile pull up -d
```

Open <http://localhost:3000>

### Option 2: Local Development

**Prerequisites**: Install [PNPM](https://pnpm.io/installation)

```bash
git clone https://github.com/sakan811/SakuMari.git
cd SakuMari
cp .env.local.example .env
# Edit .env with your Google OAuth credentials and NEXTAUTH_SECRET
docker compose up -d saku-mari-db
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm exec prisma db seed
pnpm run dev
```

Open <http://localhost:3000>

## Usage

1. **Home Page**: Choose between Hiragana or Katakana practice
2. **Flashcard Practice**: Type the romaji equivalent of the displayed character
3. **Dashboard**: View your practice statistics and character-specific accuracy
4. **Progress Tracking**: The app automatically tracks your performance and shows difficult characters more often

# Japanese Kana Flashcard Web App

A **Japanese Kana Flashcard** Web App for **practicing** Japanese Kana, specifically Hiragana and Katakana.

## Status

[![Web-App Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml)

[![Docker CI](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-ci.yml)

## How to Use the Web App on Vercel

Navigate to <https://japanese-kana-flashcard.vercel.app/>

## How to Use the Web App Locally

### Prerequisites

- **Docker**: Required for the web-app and database setup

### Setup the Web App

1. Clone the repository:

   ```bash
   git clone https://github.com/sakan811/kana-flashcard-web-app.git
   cd kana-flashcard-web-app
   ```

2. Setup the environment variables:

   - Dockerized Web-App:

     ```bash
     cp .env.docker.example .env.docker
     ```

   - Local Development with Only Postgres Docker:

     ```bash
     cp .env.local.example .env
     ```

     2.1. Generate an auth secret: <https://auth-secret-gen.vercel.app/>

     - **Dockerized Web-App**: Copy the generated secret to `.env.docker` file and paste to `AUTH_SECRET`.

     - **Local Development**: Copy the generated secret to `.env` file and paste to `AUTH_SECRET`.

      2.2. Setup Google OAuth: <https://support.google.com/googleapi/answer/6158849?hl=en>

      2.3. Copy the generated `Client ID` and `Client Secret`

        - **Dockerized setup**: Paste to `.env.docker` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

        - **Local setup**: Paste to `.env` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
  
      2.4. Paste `http://localhost:3000` to `Authorized JavaScript origins` in the Google OAuth setup.

      2.5. Paste `http://localhost:3000/api/auth/callback/google` to `Authorized redirect URIs` in the Google OAuth setup.

3. Setup Supabase:

   - Create a Supabase project at <https://supabase.com/>.
   - On your project dashboard, click `Connect`, select `ORMs`, and then select `Prisma`.
   - Copy `DATABASE_URL` to `POSTGRES_PRISMA_URL` in your environment file.
   - Copy `DIRECT_URL` to `POSTGRES_URL_NON_POOLING` in your environment file.

4. Setup the Web-App:

   - Dockerized Web-App:

     ```bash
     docker compose --profile pull up -d
     ```

   - Local Development with Postgres Docker:

     ```bash
     docker compose up -d 'jp-kana-flashcard-app-db'
     npm install
     npx prisma generate
     npx prisma migrate dev
     npx prisma db seed
     npm run dev
     ```

5. Open your browser and navigate to `http://localhost:3000`.

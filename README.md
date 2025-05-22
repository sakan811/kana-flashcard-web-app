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

   - With Dockererized Web-App:

     ```bash
     cp .env.docker.example .env.docker
     ```

   - With Only Postgres Docker:

     ```bash
     cp .env.local.example .env
     ```

     2.1. Generate an auth secret: <https://auth-secret-gen.vercel.app/>

     - With Dockererized Web-App:

       2.1.1. Copy the generated secret to `.env.docker` file and paste to `AUTH_SECRET`.

     - With Dockererized Web-App:

       2.1.1. Copy the generated secret to `.env` file and paste to `AUTH_SECRET`.

     2.2. Setup Google OAuth: <https://support.google.com/googleapi/answer/6158849?hl=en>

     2.3. Copy the generated `Client ID` and `Client Secret` to `.env.docker` or `.env` file and paste to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

     2.4. Paste `http://localhost:3000` to `Authorized JavaScript origins` in the Google OAuth setup.

     2.5. Paste `http://localhost:3000/api/auth/callback/google` to `Authorized redirect URIs` in the Google OAuth setup.

3. Setup the Web-App:

   - With Dockererized Web-App:

     ```bash
     docker compose --profile pull up -d
     ```

   - With Only Postgres Docker:

     ```bash
     docker compose up -d 'jp-kana-flashcard-app-db'
     npm install
     npx prisma generate
     npx prisma migrate dev
     npx prisma db seed
     npm run dev
     ```

4. Open your browser and navigate to `http://localhost:3000`.

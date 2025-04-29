# Japanese Kana Flashcard Web App

A **Japanese Kana Flashcard** Web App for **practicing** Japanese Kana, specifically Hiragana and Katakana.

## Status

[![Web-App Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml)

## The Web App

### Prerequisites

- **Docker**: Required for the database setup

### Setup the Web App

1. Clone the repository:

   ```bash
   git clone https://github.com/sakan811/kana-flashcard-web-app.git
   cd kana-flashcard-web-app
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   docker-compose up -d
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Setup the environment variables:

   ```bash
   cp .env.example .env
   ```

   4.1. Edit the .env file with your configuration:

   - Generate an auth secret: `make auth-secret` and copy the output to `AUTH_SECRET`
   - Your database connection string should already be set correctly for local development

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

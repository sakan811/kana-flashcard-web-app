# Japanese Kana Flashcard Web App

A **Japanese Kana Flashcard** Web App for **practicing** Japanese Kana, specifically Hiragana and Katakana.

## Status

[![Web-App Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml)

## The Web App

### Prerequisites

- **Docker**: Required for the web-app and database setup

### Setup the Web App

1. Clone the repository:

   ```bash
   git clone https://github.com/sakan811/kana-flashcard-web-app.git
   cd kana-flashcard-web-app
   ```

2. Setup the environment variables:

   ```bash
   cp .env.example .env
   ```

   - Generate an auth secret: <https://auth-secret-gen.vercel.app/>
   - Copy the generated secret to `.env` file and paste to `AUTH_SECRET`.

3. Deploy the web-app with Docker on your local machine:

   ```bash
   docker compose --profile pull up -d 
   ```

4. Open your browser and navigate to `http://localhost:3000`.

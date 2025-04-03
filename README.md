# Japanese Kana Flashcard Web App

A **Japanese Kana Flashcard** Web App for **practicing** Japanese Kana, specifically Hiragana and Katakana.

## Status

[![Web-App Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml)

## The Web App

- Navigate to <https://kana-flashcard-web-app.vercel.app/>

### Local Version

#### Prerequisites

Before starting the setup, ensure you have the following installed:

- **Make**: The utility to run Makefile commands
  - Pre-installed on most Linux/macOS systems
  - For Windows, install via [Chocolatey](https://chocolatey.org/): `choco install make` or [Scoop](https://scoop.sh/): `scoop install make`
- **Node.js**: Required for running the application
- **Docker**: Required for the database setup
- **Git**: For cloning the repository

#### Setup the Web App

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
   make compose-up
   make prisma-generate
   make prisma-migrate
   make prisma-seed
   ```

4. Setup the environment variables:

   ```bash
   cp .env.example .env
   ```

   4.1. Edit the .env file with your configuration:
      - Generate an auth secret: `make auth-secret` and copy the output to AUTH_SECRET
      - Set up GitHub OAuth:
        1. Go to GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
        2. Set Homepage URL to `http://localhost:3000`
        3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
        4. Copy Client ID to AUTH_GITHUB_ID and Client Secret to AUTH_GITHUB_SECRET
      - Your database connection string should already be set correctly for local development

5. Start the development server:

   ```bash
   make dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

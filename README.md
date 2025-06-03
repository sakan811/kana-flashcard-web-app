# SakuMari - Japanese Kana Flashcard App

A web application for practicing Japanese Hiragana and Katakana characters with interactive flashcards and progress tracking.

[![Web-App Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml)

[![Docker CI](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-ci.yml)

## Features

- **Interactive Flashcards**: Practice Hiragana and Katakana with randomized character selection
- **Progress Tracking**: View accuracy statistics and practice history
- **Adaptive Learning**: Characters with lower accuracy appear more frequently

## Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/sakan811/kana-flashcard-web-app.git
   cd kana-flashcard-web-app
   ```

2. **Set up environment variables**

   ```bash
   cp .env.docker.example .env.docker
   ```

3. **Run with Docker**

   ```bash
   docker compose --profile pull up -d
   ```

4. **Access the app**
   Open <http://localhost:3000> in your browser

### Option 2: Local Development

1. **Clone and setup**

   ```bash
   git clone https://github.com/sakan811/kana-flashcard-web-app.git
   cd kana-flashcard-web-app
   cp .env.local.example .env
   ```

2. **Start PostgreSQL database**

   ```bash
   docker compose up -d jp-kana-flashcard-app-db
   ```

3. **Install dependencies and setup database**

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Access the app**
   Open <http://localhost:3000> in your browser

## Usage

1. **Home Page**: Choose between Hiragana or Katakana practice
2. **Flashcard Practice**: Type the romaji equivalent of the displayed character
3. **Dashboard**: View your practice statistics and character-specific accuracy
4. **Progress Tracking**: The app automatically tracks your performance and shows difficult characters more often

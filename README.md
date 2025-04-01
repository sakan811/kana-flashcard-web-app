# Japanese Kana Flashcard Web App

A **Japanese Kana Flashcard** Web App for **practicing** Japanese Kana, specifically Hiragana and Katakana.

## Status

[![Docker Build](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-build.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-build.yml)

[![Push to Docker Hub](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-push.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-push.yml)

[![Web-App Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-app.yml)

## How to Use the Web App

- Navigate to <https://kana-flashcard-web-app-671v.vercel.app/>

### Local Version

#### Setup the Web App

- Download [docker-compose.yml](./docker-compose.yml) file from this repository and place it in your desired directory
- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Run:

  ```bash
  docker-compose up -d
  ```

This will:

- Start a PostgreSQL database container on port 7777
- Start the Kana Flashcard application container on port 3000
- Automatically run database migrations

#### Run the Web App

- Make sure that **Docker Desktop** and the containers are running
- Navigate to <http://localhost:3000/>

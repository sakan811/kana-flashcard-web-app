# Japanese Kana Flashcard Web App

A **Japanese Kana Flashcard** Web App for **practicing** Japanese Kana, e.g., Hiragana and Katakana.

The web-app was built to run **locally**.

# Status
[![Backend Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-backend.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-backend.yml)

[![Frontend Test](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-frontend.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-frontend.yml)

[![Frontend Test Demo](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-frontend-demo.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/test-frontend-demo.yml)

[![Docker Build](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-build.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/docker-build.yml)

[![Trivy Docker Image Scan](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/trivy-scan.yml/badge.svg)](https://github.com/sakan811/kana-flashcard-web-app/actions/workflows/trivy-scan.yml)

# How to Use the Web App 
## Demo Version
- Navigate to https://kana-flashcard-web-app-671v.vercel.app/

## Full Version
### Setup the Web App 
- Download [docker-compose.yml](docker-compose.yml) file and place at any place of your choice.
- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Open **Terminal** console
- Use `cd` command to navigate to the directory where you saved the `docker-compose.yml` file
  - For example: `cd /path/to/directory/`
- Type ```docker-compose up``` and enter

### Run the Web App
- Make sure that **Docker Desktop** is running
- Navigate to http://localhost:3000/

# Codebase Details
[Click here](docs/DOCS.md) for a brief document.

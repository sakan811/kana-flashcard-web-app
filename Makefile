.PHONY: dev build preview test update-deps clean

# Project configuration
APP_DIR := jp-kana-app

# Run development server
dev:
	cd $(APP_DIR) && npm run dev

# Build for production
build:
	cd $(APP_DIR) && npm run build

# Run tests
test:
	cd $(APP_DIR) && npm test

# lint
lint:
	cd $(APP_DIR) && npm run lint

# Update all dependencies to latest version
update-deps:
	cd $(APP_DIR) && npm update --save && npm update --save-dev

# Clean build artifacts
clean:
	cd $(APP_DIR) && rm -rf dist/ && rm -rf node_modules/ && rm -rf package-lock.json

install:
	cd $(APP_DIR) && npm install

prisma:
	cd $(APP_DIR) && npx prisma generate

migrate:
	cd $(APP_DIR) && npx prisma migrate dev

reset:
	cd $(APP_DIR) && npx prisma migrate reset

studio:
	cd $(APP_DIR) && npx prisma studio

compose-dev:
	docker compose -f docker-compose.dev.yml up --build

compose-up:
	docker compose up -d

compose-down:
	docker compose down

compose-clean:
	docker compose down --volumes --remove-orphans

# Help command
help:
	@echo "Available commands:"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build for production"
	@echo "  make preview    - Preview production build"
	@echo "  make test       - Run tests"
	@echo "  make update-deps - Update all dependencies"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make install    - Install dependencies"
	@echo "  make compose-up - Start docker compose"
	@echo "  make compose-down - Stop docker compose"
	@echo "  make prisma - Generate Prisma client"
	@echo "  make migrate - Run Prisma migrations"
	@echo "  make reset - Reset Prisma migrations"
	@echo "  make studio - Open Prisma Studio"
	@echo "  make compose-clean - Stop and remove containers and volumes for this project"

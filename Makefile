.PHONY: dev build preview test lint format check lint-format-check ci-verify update-deps clean clean-build install prisma migrate reset studio compose-build compose-up compose-down compose-clean help start

# Project configuration
APP_DIR := jp-kana-app

# Display help information
help:
	@echo "Available targets:"
	@echo "  dev              - Run development server"
	@echo "  build            - Build for production"
	@echo "  start            - Start the production server"
	@echo "  test             - Run tests"
	@echo "  lint             - Run linting"
	@echo "  format           - Format code"
	@echo "  check            - Run type checking"
	@echo "  lint-format-check - Run lint, format and check in sequence"
	@echo "  ci-verify        - Run lint, format, check, test and build (CI pipeline)"
	@echo "  clean            - Remove all build artifacts and dependencies"
	@echo "  clean-build      - Remove only build artifacts (.next folder)"
	@echo "  install          - Install dependencies"
	@echo "  prisma           - Generate Prisma client"
	@echo "  migrate          - Run Prisma migrations in dev mode"
	@echo "  reset            - Reset Prisma database"
	@echo "  studio           - Open Prisma Studio"
	@echo "  compose-build    - Build and start containers with docker-compose build config"
	@echo "  compose-up       - Start containers with docker-compose"
	@echo "  compose-down     - Stop containers"
	@echo "  compose-clean    - Stop containers and remove volumes"

# Run development server
dev:
	cd $(APP_DIR) && npm run dev

# Build for production
build:
	cd $(APP_DIR) && npm run build

start:
	cd $(APP_DIR) && npm run start

# Run tests
test:
	cd $(APP_DIR) && npm test

# lint
lint:
	cd $(APP_DIR) && npm run lint

# format
format:
	cd $(APP_DIR) && npm run format

# type check
check:
	cd $(APP_DIR) && npm run check

# Run linting, formatting, and type checking in sequence
lint-format-check:
	cd $(APP_DIR) && npm run lint && npm run format && npm run check

# Complete verification pipeline for CI (stops on first error)
ci-verify:
	cd $(APP_DIR) && npm run lint && \
	npm run format && \
	npm run check && \
	npm run test:run && \
	npm run build

# Update all dependencies to latest version
update-deps:
	cd $(APP_DIR) && npm update --save && npm update --save-dev

# Clean build artifacts
clean:
	cd $(APP_DIR) && rm -rf node_modules/ && rm -rf package-lock.json && rm -rf .next

clean-build:
	cd $(APP_DIR) && rm -rf .next

# Install dependencies
install:
	cd $(APP_DIR) && npm install

# Generate Prisma client
prisma:
	cd $(APP_DIR) && npx prisma generate

# Run Prisma database seed (caution: does not create migrations)
seed:
	cd $(APP_DIR) && npx prisma db seed

# Run Prisma database push (caution: does not create migrations)
push:
	cd $(APP_DIR) && npx prisma db push

# Run Prisma migrations in development
migrate:
	cd $(APP_DIR) && npx prisma migrate dev

# Reset Prisma database (caution: destroys data)
reset:
	cd $(APP_DIR) && npx prisma migrate reset

# Open Prisma Studio database interface
studio:
	cd $(APP_DIR) && npx prisma studio

# Build and start Docker containers with build config
compose-build:
	docker compose -f docker-compose.build.yml up --build -d

# Start Docker containers
compose-up:
	docker compose up -d

# Stop Docker containers
compose-down:
	docker compose down

# Stop containers and remove volumes (caution: destroys data)
compose-clean:
	docker compose down --volumes --remove-orphans

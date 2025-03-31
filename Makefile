.PHONY: dev build preview test update-deps clean

# Project configuration
APP_DIR := jp-kana-app

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

lint-format-check:
	cd $(APP_DIR) && npm run lint && npm run format && npm run check

# Update all dependencies to latest version
update-deps:
	cd $(APP_DIR) && npm update --save && npm update --save-dev

# Clean build artifacts
clean:
	cd $(APP_DIR) && rm -rf dist/ && rm -rf node_modules/ && rm -rf package-lock.json && rm -rf .next

clean-build:
	cd $(APP_DIR) && rm -rf .next

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

compose-build:
	docker compose -f docker-compose.build.yml up --build -d

compose-up:
	docker compose up -d

compose-down:
	docker compose down

compose-clean:
	docker compose down --volumes --remove-orphans

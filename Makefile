.PHONY: dev build preview test update-deps clean

# Run development server
dev:
	cd jp-kana-app && npm run dev

# Build for production
build:
	cd jp-kana-app && npm run build

# Preview production build
preview:
	cd jp-kana-app && npm run preview

# Run tests
test:
	cd jp-kana-app && npm test

# Update all dependencies to latest version
update-deps:
	cd jp-kana-app && npm update --save && npm update --save-dev

# Clean build artifacts
clean:
	cd jp-kana-app && rm -rf dist/ && rm -rf node_modules/ && rm -rf package-lock.json

install:
	cd jp-kana-app && npm install

prisma:
	cd jp-kana-app && npx prisma generate

migrate:
	cd jp-kana-app && npx prisma migrate dev

reset:
	cd jp-kana-app && npx prisma migrate reset

studio:
	cd jp-kana-app && npx prisma studio

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

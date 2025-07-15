dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

format:
	pnpm format

test-e2e:
	pnpm test:e2e:build && \
	pnpm test:e2e

test-all:
	pnpm test:run && \
	pnpm test:db:setup && \
	pnpm test:db && \
	pnpm test:db:clean

pre-ci: lint format test-all

generate:
	pnpm exec prisma generate

migrate:
	pnpm exec prisma migrate dev

migrate-prod:
	pnpm exec prisma migrate deploy
	
seed:
	pnpm exec prisma db seed

studio:
	pnpm exec prisma studio

reset:
	pnpm exec prisma migrate reset

setup-db:
	pnpm exec prisma generate && \
	pnpm exec prisma migrate dev && \
	pnpm exec prisma db seed

# Docker Compose commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-clean:
	docker-compose down -v --remove-orphans --rmi all

# Build-specific compose commands
docker-up-build:
	docker-compose -f docker-compose.build.yml up -d --build

docker-down-build:
	docker-compose -f docker-compose.build.yml down

docker-clean-build:
	docker-compose -f docker-compose.build.yml down -v --remove-orphans --rmi all
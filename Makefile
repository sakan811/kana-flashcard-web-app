dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

format:
	pnpm format

test-e2e:
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
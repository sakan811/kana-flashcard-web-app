dev:
	pnpm run dev

build:
	pnpm run build

lint:
	pnpm run lint

format:
	pnpm run format

test-db-setup:
	pnpm run test:db:setup

test-db:
	pnpm run test:db

test-db-clean:
	pnpm run test:db:clean

test:
	pnpm run test

test-run:
	pnpm run test:run

test-all: test-run test-db-setup test-db test-db-clean

pre-ci: lint format test-all

up:
	docker compose --profile pull up -d 

up-build:
	docker compose --profile build up -d --build

up-db:
	docker compose up -d saku-mari-db
	
down:
	docker compose --profile pull down

down-build:
	docker compose --profile build down

down-db:
	docker compose down saku-mari-db

clean:
	docker compose --profile pull down --volumes --remove-orphans --rmi all

clean-build:
	docker compose --profile build down --volumes --remove-orphans --rmi all

clean-db:
	docker compose down saku-mari-db --volumes --remove-orphans --rmi all

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
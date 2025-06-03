dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

format:
	npm run format

test:
	npm run test

test-run:
	npm run test:run

pre-ci: lint format test

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
	npx prisma generate

migrate:
	npx prisma migrate dev

migrate-prod:
	npx prisma migrate deploy
	
seed:
	npx prisma db seed

studio:
	npx prisma studio

reset:
	npx prisma migrate reset
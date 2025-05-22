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

pre-ci:
	npm run lint && \
	npm run format && \
	npm run test:run

up:
	docker compose --profile pull up -d 

build-up:
	docker compose --profile build up -d --build
	
down:
	docker compose down

clean:
	docker compose --profile pull down --volumes --remove-orphans 

clean-build:
	docker compose --profile build down --volumes --remove-orphans 

rm-image:
	docker rmi sakanbeer88/jp-kana-flashcard-app:latest

auth-secret:
	npx auth secret

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
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
	npm run test:run && \

up:
	docker-compose up -d --profile pull

build-up:
	docker-compose up -d --profile build
	
down:
	docker-compose down

clean:
	docker-compose down --volumes --remove-orphans

auth-secret:
	npx auth secret

generate:
	npx prisma generate

migrate:
	npx prisma migrate dev

seed:
	npx prisma db seed

studio:
	npx prisma studio

reset:
	npx prisma migrate reset
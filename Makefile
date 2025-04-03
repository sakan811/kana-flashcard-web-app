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
	npm run build

compose-up:
	docker-compose up -d
	
compose-down:
	docker-compose down

compose-clean:
	docker-compose down --volumes --remove-orphans

auth-secret:
	npx auth secret

prisma-generate:
	npx prisma generate

prisma-migrate:
	npx prisma migrate dev

prisma-seed:
	npx prisma db seed

prisma-studio:
	npx prisma studio

prisma-reset:
	npx prisma migrate reset
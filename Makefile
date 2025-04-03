dev:
	npm run dev

lint:
	npm run lint

test:
	npm run test

test-run:
	npm run test:run

compose-up:
	docker-compose up -d
	
compose-down:
	docker-compose down

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
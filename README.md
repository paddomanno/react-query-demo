Start db:

- put postgres url in .env
- docker-compose up

Start node:

- npm i
- npx prisma migrate dev --name init
- npm run dev

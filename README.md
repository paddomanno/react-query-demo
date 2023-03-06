Start db:

- put postgres url in .env
- docker-compose up

Start backend:

- npm i
- npx prisma migrate dev --name init
- npm run dev

Start frontend:

- put VITE_API_BASE_URL="localhost:7000" in .env

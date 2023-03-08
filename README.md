## How to use

Start db:

- put postgres url in .env
- docker-compose up

Start backend:

- npm i
- npx prisma migrate dev --name init
- npm run dev

Start frontend:

- put VITE_API_BASE_URL="localhost:7000" in .env

## Features

- seeding the database using Faker.js
- get a list of posts (PostList)
  - uses infinite scroll
  - fetches automatically when scrolling
- read a post (PostDetails)
- get all posts with tag (PostListByTag)
  - uses pagination
- get user's details and their posts (UserDetails)
- write a post
  - redirects to post details
  - reads directly from cache / no refetching

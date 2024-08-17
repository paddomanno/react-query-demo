# react-query-demo

With "react-query-demo", you can browse through fictional posts made by fictional users, explore by tags, and create your own post. Main features are infinite scrolling, pagination, and skeleton loading. The app follows a design similar to [Dev.to](dev.to) or other developer blogs, but with a much simpler data model.

## Tech Stack

- [React](https://reactjs.org/): A JavaScript library for building user interfaces
- [Bootstrap](https://getbootstrap.com/): A popular CSS framework for responsive web design
- [Tanstack Query](https://tanstack.com/query/v4): A powerful state management solution for React, used to be called React-Query
- [Faker.js](https://fakerjs.dev/): A library for creating all kinds of test data which I use to seed the database
- [Typescript](https://www.typescriptlang.org/): A statically typed superset of JavaScript that compiles to plain JavaScript
- [Express](https://expressjs.com/): A web application framework for Node.js
- [Prisma ORM](https://www.prisma.io/): A modern database toolkit that allows you to query your database using a type-safe and intuitive API
- [PostgreSQL](https://www.postgresql.org/): A powerful, open source object-relational database system

## Screenshot

![alt text](react-query-demo.PNG)

## Features

- Browse through posts made by users, sorted by tags
- Create your own post
- Infinite scrolling
- Pagination
- Skeleton loading

### Features from a dev perspective

- seeding the database using Faker.js
- the main list of posts (PostList) uses infinite scroll (fetches automatically when scrolling)
- you can read a post (PostDetails)
- or get all posts with tag (PostListByTag)
  - uses pagination
- or get a user's details and their posts (UserDetails)
- after writing a post, the user is redirected to the post details page and the post data is read directly from cache / no refetching

## Project Status

This project is currently unmaintained, but it still works when run locally. There is no live demo hosted at the moment.

## Running Locally

To run the project locally, follow these steps:

1. Clone the repository
2. Starting the database

   1. Make sure you have a `.env` file in the `backend/` directory with the following content (has to match the connection data defined in the `docker-compose.yml` file):

   ```
   DATABASE_URL="postgresql://postgres:mysecret@localhost:5432/postgres?schema=public"
   PORT=7000
   ```

   2. Start the database using `docker-compose up`

3. Preparing the backend and database (if you are starting the project for the first time)
   1. `cd backend/`
   2. Install dependencies using `npm install`
   3. Migrate db schema using `npx prisma migrate dev --name init`
   4. Seed the database using `npx prisma db seed`
4. Start the backend using `npm run dev`
5. Starting the frontend

   1. `cd frontend/`
   2. Make sure you have a `.env` file in the `frontend/` directory with the following content (has to match the port defined earlier in `/backend/.env`):

   ```
   VITE_API_BASE_URL="localhost:7000"
   ```

6. `npm run dev`
7. Open your browser and navigate to the url given in the console output by Vite (probably `http://localhost:5173`)
8. You can now explore the app, and even use the React Query Devtools (bottom left corner) to explore the state of the app

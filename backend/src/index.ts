/**
 * Required external modules / project dependencies
 */

import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PostController } from './controllers/post.controller';
import { TagController } from './controllers/tag.controller';
import { UserController } from './controllers/user.controller';

dotenv.config();

/**
 * Check app env variables
 */

if (!process.env.PORT) {
  console.error('Environment variable PORT not found');
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

/**
 *  app configuration / mount middleware
 */

const app = express();

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = [
  'http://localhost:5713',
  'http://127.0.0.1:5173',
  'https://react-query-demo-mu.vercel.app',
  'https://react-query-demo-git-master-paddomanno.vercel.app',
  'https://react-query-demo-paddomanno.vercel.app',
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(helmet()); //set sensible defaults for HTTP response headers
app.use(cors(corsOptions)); //enable all CORS requests
app.use(express.json()); //parse incoming requests with JSON payloads

/**
 * Server Activation
 */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.status(200).send('Alive!');
});

app.use('/api/users', UserController);
app.use('/api/posts', PostController);
app.use('/api/tags', TagController);

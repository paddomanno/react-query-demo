import { Prisma } from '@prisma/client';
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prismaClient';
const router = Router({ mergeParams: true });

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { _count: { select: { posts: true } } },
    });
    if (users) {
      return res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET a user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id as string, 10),
      },
    });
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send(`User with ID ${id} not found`);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// GET all posts by a user
router.get('/:id/posts', async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdDate: 'desc',
      },
      where: {
        authorId: parseInt(id as string, 10),
      },
      include: { tags: true },
    });
    if (posts) {
      return res.status(200).send(posts);
    }
    return res.status(404).send(`User with ID ${id} not found`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST a user
router.post(
  '/',
  [
    // validate here
  ],
  async (req: Request, res: Response) => {
    const newUser: Omit<Prisma.UserCreateInput, 'posts'> = req.body;
    try {
      const createdUser = await prisma.user.create({
        data: {
          ...newUser,
        },
      });
      return res.status(201).json(createdUser);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);
export const UserController = router;

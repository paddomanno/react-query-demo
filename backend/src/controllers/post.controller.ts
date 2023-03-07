import { Prisma } from '@prisma/client';
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prismaClient';
import { body, validationResult } from 'express-validator';
const router = Router({ mergeParams: true });

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdDate: 'asc',
      },
      include: { author: true, tags: true },
    });
    if (posts) {
      return res.status(200).send(posts);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET a post by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id as string, 10),
      },
      include: { tags: true },
    });
    if (post) {
      return res.status(200).send(post);
    }
    return res.status(404).send(`Post with ID ${id} not found`);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// POST a post
router.post(
  '/',
  [
    // validate here
  ],
  async (req: Request, res: Response) => {
    const newPost: Omit<Prisma.PostCreateInput, 'tags'> = req.body;
    const newTags: string[] = req.body.tags;
    try {
      const createdPost = await prisma.post.create({
        data: {
          ...newPost,
          tags: {
            connectOrCreate: newTags.map((tagName) => {
              return {
                where: { name: tagName },
                create: { name: tagName },
              };
            }),
          },
        },
        include: { tags: true },
      });
      return res.status(201).json(createdPost);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);
export const PostController = router;

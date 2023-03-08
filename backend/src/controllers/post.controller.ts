import { Prisma, Tag } from '@prisma/client';
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prismaClient';
import { body, validationResult } from 'express-validator';
const router = Router({ mergeParams: true });

// GET all posts
router.get('/all', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdDate: 'desc',
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

// GET posts paginated
router.get('/', async (req, res) => {
  const { _page, _sortBy, _limit } = req.query;
  console.log(_page, _sortBy, _limit);
  if (
    typeof _page !== 'string' ||
    typeof _sortBy !== 'string' ||
    typeof _limit !== 'string'
  ) {
    return res.status(500).send('Query parameters must be strings');
  }
  const page = parseInt(_page) || 1; // Default to page 1 if _page is not a number
  const limit = parseInt(_limit) || 5; // Default entries per page if _limit is not a number

  const skip = (page - 1) * limit;
  try {
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      orderBy: _sortBy
        ? {
            [_sortBy]: 'desc',
          }
        : {
            createdDate: 'desc',
          },
      include: { author: true, tags: true },
    });
    // Include the count of all items matching the query criteria
    const totalCount = await prisma.post.count({});
    if (posts) {
      res.setHeader('x-total-count', totalCount.toString());
      res.setHeader('Access-Control-Expose-Headers', 'x-total-count');
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

// GET all posts with tag
router.get('/tagged/:tag', async (req, res) => {
  const tagName: string = req.params.tag;
  const { _page, _sortBy, _limit } = req.query;
  if (
    typeof _page !== 'string' ||
    typeof _sortBy !== 'string' ||
    typeof _limit !== 'string'
  ) {
    return res.status(500).send('Query parameters must be strings');
  }

  const page = parseInt(_page) || 1; // Default to page 1 if _page is not a number
  const limit = parseInt(_limit) || 5; // Default entries per page if _limit is not a number

  const skip = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      where: {
        tags: {
          some: {
            name: tagName,
          },
        },
      },
      orderBy: _sortBy
        ? {
            [_sortBy]: 'desc',
          }
        : {
            createdDate: 'desc',
          },
      include: { tags: true, author: true },
    });
    // Include the count of all items matching the query criteria
    const totalCount = await prisma.post.count({
      where: {
        tags: {
          some: {
            name: tagName,
          },
        },
      },
    });
    if (posts) {
      res.setHeader('x-total-count', totalCount.toString());
      res.setHeader('Access-Control-Expose-Headers', 'x-total-count');
      return res.status(200).send(posts);
    }
    return res.status(404).send(`Tag with name ${tagName} not found`);
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
    const {
      title,
      content,
      authorId,
      imgUrl,
      tags,
    }: Prisma.PostCreateInput & { authorId: number; tags: Tag[] } =
      req.body;
    try {
      const createdPost = await prisma.post.create({
        data: {
          title,
          content,
          imgUrl,
          author: {
            connect: {
              id: authorId,
            },
          },
          tags: {
            connectOrCreate: tags.map((tag) => {
              return {
                where: { name: tag.name },
                create: { name: tag.name },
              };
            }),
          },
        },
        include: { tags: true, author: true },
      });
      return res.status(201).json(createdPost);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);
export const PostController = router;

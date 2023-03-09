import { Prisma } from '@prisma/client';
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prismaClient';
const router = Router({ mergeParams: true });

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    if (tags) {
      return res.status(200).send(tags);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET a tag by id
router.get('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        name: name,
      },
    });
    if (tag) {
      return res.status(200).send(tag);
    }
    return res.status(404).send(`Tag with name '${name}' not found`);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// POST a tag
router.post(
  '/',
  [
    // validate here
  ],
  async (req: Request, res: Response) => {
    const newTag: Prisma.TagCreateInput = req.body;
    try {
      const createdTag = await prisma.tag.create({
        data: {
          ...newTag,
        },
      });
      return res.status(201).json(createdTag);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);
export const TagController = router;

import prisma from "../utils/prisma.js"
import express from 'express'
const router = express.Router();

// Define endpoint to retrieve all posts
router.get('/records', async (req, res) => {
  try {
    const posts = await prisma.image.findMany();
    return res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router
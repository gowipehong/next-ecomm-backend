import prisma from "../utils/prisma.js"
import auth from "../middlewares/auth.js"
import express from 'express'
const router = express.Router();

// Create image
router.post('/', auth, async (req, res) => {
  const data = req.body

  try {
    const newImage = await prisma.image.create({
      data: {
        userId: req.user.payload.id,
        title: data.title,
        url: data.url,
        description: data.description,
        price: data.price
      }
    });

    return res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create image' });
  }
});

export default router;


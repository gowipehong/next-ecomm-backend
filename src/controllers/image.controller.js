import prisma from "../utils/prisma.js"
import auth from "../middlewares/auth.js"
import { validateImages } from "../validators/images.js"
import express from 'express'
const router = express.Router();

// Create image
router.post('/', auth, async (req, res) => {
  const data = req.body

  const validationErrors = validateImages(data)

  if (Object.keys(validationErrors).length != 0) return res.status(400).send({
    error: validationErrors
  })


  const newImage = await prisma.image.create({
    data: {
      userId: req.user.payload.id,
      title: data.title,
      url: data.url,
      description: data.description,
      price: parseInt(data.price) //convert string to int as schema accept Int
    }
  });

  return res.status(200).json(newImage);

});

export default router;


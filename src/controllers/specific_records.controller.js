import express from 'express'
import prisma from '../utils/prisma.js'
const router = express.Router()

router.get('/:id', async (req, res) => {
  const post = await prisma.image.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })

  if (post) {
    return res.json(post)
  } else {
    res.status(404).json({ message: 'Image post not found' })
  }
})

export default router
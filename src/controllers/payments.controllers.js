import express from 'express'
import stripeInstance from 'stripe';
import prisma from '../utils/prisma.js'

const stripe = stripeInstance(process.env.API_KEY_STRIPE)
const router = express.Router()
let images


async function getImage(id) {
  images = await prisma.image.findUnique({
    where: {
      id
    }
  })
  return images
}

router.post('/:id', async (req, res) => {
  const image = await getImage(parseInt(req.params.id))
  let itemData = [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: image.title
      },
      unit_amount: image.price
    },
    quantity: 1
  }]
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: itemData,
    success_url: 'https://google.com',
    cancel_url: 'https://youtube.com'
  })
  return res.json({ url: session.url })
})

export default router


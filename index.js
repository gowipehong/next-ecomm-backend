import express from "express"
import prisma from "./src/utils/prisma.js"
import Prisma from '@prisma/client';

const app = express()
const port = process.env.PORT || 8080

app.use(express.json());

function filter(obj, ...keys) {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})
} 

function validateUser(input) {
  const validationErrors = {}

  if (!('name' in input) || input['name'].length == 0) {
    validationErrors['name'] = 'cannot be blank'
  }

  if (!('email' in input) || input['email'].length == 0) {
    validationErrors['email'] = 'cannot be blank'
  }

  if (!('password' in input) || input['password'].length == 0) {
    validationErrors['password'] = 'cannot be blank'
  }

  if ('password' in input && input['password'].length < 8) {
    validationErrors['password'] = 'should be at least 8 characters'
  }

  if ('email' in input && !input['email'].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    validationErrors['email'] = 'is invalid'
  }

  return validationErrors
}

app.post('/users', async (req, res) => {
  const data = req.body;
  
  const validationErrors = validateUser(data)

  if (Object.keys(validationErrors).length != 0) return res.status(400).send({
    error: validationErrors
  })

  try {
    const newUser = await prisma.user.create({
      data
    });
    return res.json(filter(newUser, 'id', 'name', 'email'));  
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const formattedError = {};
      formattedError[`${err.meta.target[0]}`] = 'already taken';
      return res.status(500).send({ error: formattedError }); 
    }
    throw err;
  }
});

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})

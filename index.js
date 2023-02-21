import express from "express"
import cors from "cors";
import prisma from "./src/utils/prisma.js"
import Prisma from '@prisma/client';
import bcrypt from "bcryptjs";
import { signAccessToken } from "./src/utils/jwt.js";

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json());

function filter(obj, ...keys) {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})
}

function validateUser(input) {
  const validationErrors = {}

  if (!('name' in input) || input['name'].length == 0) {
    validationErrors['name'] = 'Cannot be blank'
  }

  if (!('email' in input) || input['email'].length == 0) {
    validationErrors['email'] = 'Cannot be blank'
  }

  if (!('password' in input) || input['password'].length == 0) {
    validationErrors['password'] = 'Cannot be blank'
  }

  if ('password' in input && input['password'].length < 8) {
    validationErrors['password'] = 'should be at least 8 characters'
  }

  if ('email' in input && !input['email'].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    validationErrors['email'] = 'Invalid Email'
  }

  return validationErrors
}

function validateLogin(input) {
  const validationErrors = {}

  if (!('email' in input) || input['email'].length == 0) {
    validationErrors['email'] = 'cannot be blank'
  }

  if (!('password' in input) || input['password'].length == 0) {
    validationErrors['password'] = 'cannot be blank'
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
    data.password = bcrypt.hashSync(data.password, 8);
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

app.post('/sign-in', async (req, res) => {
  const data = req.body

  const validationErrors = validateLogin(data)

  if (Object.keys(validationErrors).length != 0) return res.status(400).send({
    error: validationErrors
  })

  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (!user) return res.status(401).send({
    error: 'Email address or password not valid'
  })

  const checkPassword = bcrypt.compareSync(data.password, user.password)
  if (!checkPassword) return res.status(401).send({
    error: 'Email address or password not valid'
  })

  const accessToken = await signAccessToken(user)
  return res.json({ accessToken })
})


app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})

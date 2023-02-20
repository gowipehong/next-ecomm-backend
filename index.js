import express from "express"
import prisma from "./src/utils/prisma.js"

const app = express()
const port = process.env.PORT || 8080

app.use(express.json());

app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await prisma.user.create({
    data: {
      name, 
      email,
      password
    },
  });

  res.json(newUser);
});

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})

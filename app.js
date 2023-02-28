import express from "express"
import cors from "cors";
import userRouter from "./src/controllers/users.controllers.js"
import authRouter from "./src/controllers/auth.controllers.js"
import auth from "./src/middlewares/auth.js"
import morgan from "morgan"
const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

app.use('/users', userRouter)
app.use('/auth', authRouter)

//temporary authenticated route
app.get('/protected', auth, (req, res) => {
  res.json({ "hello": "world" })
})

export default app



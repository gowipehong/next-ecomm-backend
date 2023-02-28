import express from "express"
import cors from "cors";
import userRouter from "./src/controllers/users.controllers.js"
import authRouter from "./src/controllers/auth.controllers.js"
import imagesRouter from "./src/controllers/image.controller.js"
import auth from "./src/middlewares/auth.js"
import morgan from "morgan"
const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/images', imagesRouter)

export default app



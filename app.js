import express from "express"
import cors from "cors";
import userRouter from "./src/controllers/users.controllers.js"
import authRouter from "./src/controllers/auth.controllers.js"
import imagesRouter from "./src/controllers/image.controller.js"
import recordsRouter from "./src/controllers/records.controller.js"
import paymentsRouter from "./src/controllers/payments.controllers.js"
import morgan from "morgan"
const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/images', imagesRouter)
app.use('/imagepost', recordsRouter)
app.use('/payment', paymentsRouter)


export default app



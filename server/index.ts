import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import errorMiddleware from './middleware/errors'
import { requestLogger } from './middleware/logger'
import weightRouter from './router'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use(requestLogger)
app.use(express.static('static'))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello there!')
})

app.use('/api', weightRouter)

app.use(errorMiddleware)

async function startApp() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

startApp()

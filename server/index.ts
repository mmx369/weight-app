import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'node:path'
import errorMiddleware from './middleware/errorMiddleware'
import apiRouter from './routers'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
)
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../../client/build')))

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/index.html'))
})

app.use('/api', apiRouter)

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'))
})

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

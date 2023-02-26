import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import { unknownEndpoint } from './middleware/errors'
import { requestLogger } from './middleware/logger'
import Challenge from './models/challenge'

dotenv.config()

let data = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Max' },
]

const app: Express = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(requestLogger)
app.use(express.static('build'))
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello there!')
})

app.get('/api/setchallenge', async (req: Request, res: Response) => {
  const data = await Challenge.find({})
  res.json(data)
})

app.post('/api/setchallenge', async (req: Request, res: Response) => {
  if (req.body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  const { name, currentWeight, targetWeight, targetDate } = <
    {
      name: string
      currentWeight: string
      targetWeight: string
      targetDate: string
    }
  >req.body

  const challenge = new Challenge({
    name,
    currentWeight: Number(currentWeight),
    targetWeight: Number(targetWeight),
    targetDate: new Date(targetDate),
  })

  const response = await challenge.save()
  res.status(200).json(response)
})

app.delete('/api/setchallenge/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const response = await Challenge.findByIdAndRemove(id)
  res.status(200).json(response)
})

app.get('/api/setchallenge/names', async (req: Request, res: Response) => {
  const data = await Challenge.find({}).select('name -_id')
  const names = data.map((el) => el.name)
  console.log(555, names)
  res.status(200).json(names)
})

app.use(unknownEndpoint)

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then((result) => {
    app.listen(port, () => {
      console.log(`[server]: Server is running at https://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })

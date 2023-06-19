import mongoose from 'mongoose'

export interface IWeight {
  user: string
  weight: number
  change: number
  date: Date
}

const Weight = new mongoose.Schema<IWeight>({
  user: { type: String, required: true },
  weight: { type: Number, required: true },
  change: { type: Number, required: true },
  date: { type: Date, required: true },
})

export default mongoose.model<IWeight>('Weight', Weight)

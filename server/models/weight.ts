import mongoose from 'mongoose'

export interface IWeight {
  name: string
  weight: number
  change: number
  date: Date
}

const Weight = new mongoose.Schema<IWeight>({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  change: { type: Number, required: true },
  date: { type: Date, required: true },
})

export default mongoose.model<IWeight>('Weight', Weight)

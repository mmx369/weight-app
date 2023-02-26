import mongoose from 'mongoose'

export interface IChallenge extends Document {
  name: string
  currentWeight: number
  targetWeight: number
  targetDate: Date
}

const Schema = mongoose.Schema

const challengeSchema = new Schema<IChallenge>(
  {
    name: {
      type: String,
      required: true,
    },
    currentWeight: {
      type: Number,
      required: true,
    },
    targetWeight: {
      type: Number,
      required: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema)

export default Challenge

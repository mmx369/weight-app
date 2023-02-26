import mongoose from 'mongoose'

const Schema = mongoose.Schema

const targetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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

exports = mongoose.model('Target', targetSchema)

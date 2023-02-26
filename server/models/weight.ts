import mongoose from 'mongoose'

const Weight = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  date: { type: Date, required: true },
})

export default mongoose.model('Weight', Weight)

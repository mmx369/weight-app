import { model, Schema } from 'mongoose'

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'UserSchema' },
  refreshToken: { type: String, required: true },
})

export default model('TokenSchema', TokenSchema)

import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  firstName: { type: String, default: '' },
  familyName: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null },
  height: { type: Number, default: null },
})

export default model('UserSchema', UserSchema)

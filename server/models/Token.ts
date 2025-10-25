import { model, Schema } from 'mongoose';

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'UserSchema' },
  refreshToken: { type: String, required: true },
});

TokenSchema.index({ user: 1 });
TokenSchema.index({ refreshToken: 1 });

export default model('TokenSchema', TokenSchema);

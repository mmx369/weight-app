import mongoose from 'mongoose';

export interface IWeight {
  user: mongoose.Types.ObjectId;
  weight: number;
  change: number;
  date: Date;
  dayKey: string;
}

const Weight = new mongoose.Schema<IWeight>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema', required: true },
  weight: { type: Number, required: true },
  change: { type: Number, required: true },
  date: { type: Date, required: true },
  dayKey: { type: String, required: true },
});

Weight.pre('validate', function (next) {
  if (this.date) {
    this.dayKey = this.date.toISOString().slice(0, 10);
  }
  next();
});

Weight.index({ user: 1, date: -1 }); // Основной индекс запросов истории веса
Weight.index({ user: 1, dayKey: 1 }, { unique: true }); // Гарантия одной записи в день

export default mongoose.model<IWeight>('Weight', Weight);

import mongoose from 'mongoose';

export interface IWeight {
  user: string;
  weight: number;
  change: number;
  date: Date;
}

const Weight = new mongoose.Schema<IWeight>({
  user: { type: String, required: true },
  weight: { type: Number, required: true },
  change: { type: Number, required: true },
  date: { type: Date, required: true },
});

Weight.index({ user: 1, date: -1 }); // Составной индекс для быстрого поиска по пользователю и дате
Weight.index({ user: 1 }); // Индекс для поиска по пользователю

export default mongoose.model<IWeight>('Weight', Weight);

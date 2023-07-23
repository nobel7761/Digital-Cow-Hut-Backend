import { model, Schema } from 'mongoose';
import { CowModel, ICow } from './cow.interface';

const cowSchema = new Schema<ICow, CowModel>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    breed: { type: String, required: true },
    weight: { type: Number, required: true },
    label: { type: String, required: true },
    category: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true, //for getting the createdAt, updatedAt from mongoose
  }
);

export const Cow = model<ICow, CowModel>('Cow', cowSchema);

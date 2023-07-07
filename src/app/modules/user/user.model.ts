import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, immutable: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  {
    timestamps: true, //for getting the createdAt, updatedAt from mongoose
  }
);

export const User = model<IUser, UserModel>('User', userSchema);

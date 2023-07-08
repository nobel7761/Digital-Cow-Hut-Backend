import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, immutable: true }, //When a field is marked as immutable: true in Mongoose, it indicates that the value of that field cannot be modified once it is set. In other words, it makes the field read-only and prevents any updates to that field.
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

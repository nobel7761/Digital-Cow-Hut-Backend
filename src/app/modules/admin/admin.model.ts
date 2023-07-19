import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';

export const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    phoneNumber: { type: String, unique: true, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
    name: {
      required: true,
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
    },
    address: { type: String, required: true },
    profileImage: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);

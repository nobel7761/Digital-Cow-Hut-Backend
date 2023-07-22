/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import config from '../../../config';
import bcrypt from 'bcrypt';

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

AdminSchema.statics.isAdminExistByPhoneNumber = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, 'phoneNumber' | 'role' | 'password'> | null> {
  return await Admin.findOne(
    { phoneNumber },
    { _id: 1, phoneNumber: 1, role: 1, password: 1 }
  );
};

AdminSchema.statics.isAdminExistByID = async function (
  id: string
): Promise<Pick<IAdmin, '_id' | 'role' | 'password' | 'phoneNumber'> | null> {
  return await Admin.findOne(
    { _id: id },
    { _id: 1, phoneNumber: 1, role: 1, password: 1 }
  );
};

AdminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

AdminSchema.pre('save', async function (next) {
  //! hash password
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);

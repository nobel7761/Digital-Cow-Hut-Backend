/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import config from '../../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, immutable: true }, //When a field is marked as immutable: true in Mongoose, it indicates that the value of that field cannot be modified once it is set. In other words, it makes the field read-only and prevents any updates to that field.
    role: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
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

userSchema.statics.isUserExistByPhoneNumber = async function (
  phoneNumber: string
): Promise<Pick<IUser, '_id' | 'phoneNumber' | 'role' | 'password'> | null> {
  return await User.findOne(
    { phoneNumber },
    { _id: 1, phoneNumber: 1, role: 1, password: 1 }
  );
};

userSchema.statics.isUserExistByID = async function (
  id: string
): Promise<Pick<IUser, '_id' | 'role' | 'password' | 'phoneNumber'> | null> {
  return await User.findById(
    { _id: id },
    { _id: 1, phoneNumber: 1, role: 1, password: 1 }
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  //! hash password
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const User = model<IUser, UserModel>('User', userSchema);

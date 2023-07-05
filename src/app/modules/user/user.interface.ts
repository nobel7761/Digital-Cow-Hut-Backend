import { Model } from 'mongoose';

export type IUser = {
  id: string;
  role: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
  budget: string;
  income: string;
};

export type UserModel = Model<IUser, Record<string, unknown>>;

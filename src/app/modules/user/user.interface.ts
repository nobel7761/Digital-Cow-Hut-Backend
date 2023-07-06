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
  budget: number;
  income: number;
};

export type IUserFilters = {
  searchTerm?: string;
  id?: string;
  role?: string;
};

export type UserModel = Model<IUser, Record<string, unknown>>;

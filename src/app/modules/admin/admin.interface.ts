import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  phoneNumber: string;
  role: string;
  name: UserName;
  password: string;
  address: string;
  profileImage?: string;
};

export type IAdminResponse = {
  phoneNumber: string;
  role: string;
  name: UserName;
  password?: string;
  address: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

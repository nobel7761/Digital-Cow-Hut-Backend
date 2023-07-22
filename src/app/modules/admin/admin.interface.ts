/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  _id?: string;
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

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type AdminModel = {
  isAdminExist(
    phoneNumber: string
  ): Promise<Pick<IAdmin, '_id' | 'phoneNumber' | 'role' | 'password'> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;

// export type AdminModel = Model<IAdmin, Record<string, unknown>>;

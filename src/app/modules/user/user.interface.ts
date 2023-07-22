/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  id: string;
  _id?: string;
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

export type ILoginUser = {
  phoneNumber: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type UserModel = {
  isUserExistByPhoneNumber(
    phoneNumber: string
  ): Promise<Pick<IUser, '_id' | 'phoneNumber' | 'role' | 'password'> | null>;

  isUserExistByID(
    id: string
  ): Promise<Pick<IUser, '_id' | 'role' | 'password' | 'phoneNumber'>>;

  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;

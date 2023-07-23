import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: string;
  breed: string;
  weight: number;
  label: string;
  category: string;
  seller: IUser | Types.ObjectId;
};

export type ICowFilters = {
  searchTerm?: string;
  location?: string;
  breed?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
};

export type CowModel = Model<ICow, Record<string, unknown>>;

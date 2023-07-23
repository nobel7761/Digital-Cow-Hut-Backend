import { Model } from 'mongoose';
import { ICow } from '../cow/cow.interface';
import { IUser } from '../user/user.interface';
import { Types } from 'mongoose';

export type IOrder = {
  cow: ICow | Types.ObjectId;
  buyer: IUser | Types.ObjectId;
};

export type IOrderFilters = {
  searchTerm?: string;
  cow?: string;
  buyer?: string;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;

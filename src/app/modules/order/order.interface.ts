import { Model } from 'mongoose';

export type IOrder = {
  cow: string;
  buyer: string;
};

export type IOrderFilters = {
  searchTerm?: string;
  cow?: string;
  buyer?: string;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;

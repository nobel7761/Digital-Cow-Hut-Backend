import { model, Schema } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    cow: { type: String, required: true },
    buyer: { type: String, required: true },
  },
  {
    timestamps: true, //for getting the createdAt, updatedAt from mongoose
  }
);

export const Order = model<IOrder, OrderModel>('Order', orderSchema);

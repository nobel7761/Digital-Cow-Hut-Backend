import { model, Schema } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    cow: { type: Schema.Types.ObjectId, ref: 'Cow', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true, //for getting the createdAt, updatedAt from mongoose
  }
);

export const Order = model<IOrder, OrderModel>('Order', orderSchema);

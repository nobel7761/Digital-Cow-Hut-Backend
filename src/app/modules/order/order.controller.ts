import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { paginationFields } from '../../../constants/pagination';
import { orderFilterableFields } from './order.constant';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { ...orderData } = req.body;
  const result = await OrderService.createOrder(orderData);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OrderService.getAllOrders(filters, paginationOptions);

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders Retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
};

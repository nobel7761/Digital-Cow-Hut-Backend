import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { paginationFields } from '../../../constants/pagination';
import { orderFilterableFields } from './order.constant';
import { OrderService } from './order.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
  const accessToken = req.headers.authorization as string;
  const decodedToken = jwt.decode(accessToken, { complete: true }) as {
    payload: JwtPayload;
  } | null;
  const userId = decodedToken?.payload?.userId;
  const role = decodedToken?.payload?.role;

  const filters = pick(req.query, orderFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  // console.log(userId, role);

  const result = await OrderService.getAllOrders(
    userId,
    role,
    filters,
    paginationOptions
  );

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

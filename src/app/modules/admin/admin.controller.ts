import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdminResponse, ILoginAdminResponse } from './admin.interface';
import httpStatus from 'http-status';
import { AdminService } from './admin.service';
import config from '../../../config';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body;
  const result = await AdminService.createAdmin(adminData);

  sendResponse<IAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.loginAdmin(loginData);

  const { refreshToken, ...others } = result as ILoginAdminResponse;

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production' ? true : false,
    httpOnly: true, // to make sure that this cookie won't be accessible from client side
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Logged In Successfully!',
    data: others,
  });
});

export const AdminController = {
  createAdmin,
  loginAdmin,
};

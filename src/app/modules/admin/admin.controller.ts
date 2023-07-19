/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdminResponse } from './admin.interface';
import httpStatus from 'http-status';
import { AdminService } from './admin.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body;
  const result = await AdminService.createAdmin(adminData);
  const { password, ...others } = result as IAdminResponse;

  sendResponse<IAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: others,
  });
});

export const AdminController = {
  createAdmin,
};

import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { ICow } from './cow.interface';
import { Request, Response } from 'express';
import { cowFilterableFields } from './cow.constant';
import { CowService } from './cow.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

const createCow = catchAsync(async (req: Request, res: Response) => {
  const { ...cowData } = req.body;
  const result = await CowService.createCow(cowData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow created successfully',
    data: result,
  });
});

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  // // Parse minPrice and maxPrice from the request query parameters
  // const minPrice = req.query.minPrice
  // const maxPrice = req.query.maxPrice

  // // Add minPrice and maxPrice filters to the filters object
  // if (!isNaN(minPrice)) {
  //   filters.minPrice = minPrice.toString();
  // }
  // if (!isNaN(maxPrice)) {
  //   filters.maxPrice = maxPrice.toString();
  // }

  const result = await CowService.getAllCows(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows Retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getCowById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CowService.getCowById(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Cow retrieved successfully',
    data: result,
  });
});

const updateCowById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const accessToken = req.headers.authorization as string;
  const decodedToken = jwt.decode(accessToken, { complete: true }) as {
    payload: JwtPayload;
  } | null;
  const sellerId = decodedToken?.payload?.userId;

  const result = await CowService.updateCowById(id, sellerId, updatedData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated successfully',
    data: result,
  });
});

const deleteCowById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const accessToken = req.headers.authorization as string;
  const decodedToken = jwt.decode(accessToken, { complete: true }) as {
    payload: JwtPayload;
  } | null;
  const sellerId = decodedToken?.payload?.userId;

  const result = await CowService.deleteCowById(id, sellerId);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCows,
  getCowById,
  updateCowById,
  deleteCowById,
};

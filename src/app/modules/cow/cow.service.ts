/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import * as httpStatus from 'http-status';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { cowSearchableFields } from './cow.constant';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { User } from '../user/user.model';

const createCow = async (cow: ICow): Promise<ICow | null> => {
  const isSellerExists = await User.findOne({
    _id: cow.seller,
    role: 'seller',
  });

  if (!isSellerExists)
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller Not Found!');

  const result = (await Cow.create(cow)).populate('seller');
  return result;
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (minPrice !== undefined) {
    andConditions.push({ price: { $gte: minPrice } });
  }

  if (maxPrice !== undefined) {
    andConditions.push({ price: { $lte: maxPrice } });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  //making an object by which sorting will be retrieved!
  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCowById = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findOne({ _id: id }).populate('seller');
  return result;
};

const updateCowById = async (
  id: string,
  sellerId: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Cow Not Found');

  const ObjectId = Types.ObjectId;
  const sellerIdAsObjectId = new ObjectId(sellerId);

  if (!(isExist.seller as Types.ObjectId).equals(sellerIdAsObjectId)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('seller');

  return result;
};

const deleteCowById = async (
  cowId: string,
  sellerId: string
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: cowId });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Cow Not Found');

  const ObjectId = Types.ObjectId;
  const sellerIdAsObjectId = new ObjectId(sellerId);

  if (!(isExist.seller as Types.ObjectId).equals(sellerIdAsObjectId)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const cow = await Cow.findOneAndDelete({ _id: cowId }).populate('seller');

  return cow;
};

export const CowService = {
  createCow,
  getAllCows,
  getCowById,
  updateCowById,
  deleteCowById,
};

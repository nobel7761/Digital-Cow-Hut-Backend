/* eslint-disable no-unused-expressions */
import mongoose, { SortOrder } from 'mongoose';
import { generateUserId } from './user.utils';
import ApiError from '../../../errors/ApiError';
import * as httpStatus from 'http-status';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { userSearchableFields } from './user.constant';
import { paginationHelpers } from '../../../helpers/paginationHelpers';

const createUser = async (user: IUser): Promise<IUser | null> => {
  let newUserAllData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const id = await generateUserId();

    user.id = id;

    //create user
    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();

    await session.endSession();

    throw error;
  }

  //user --> faculty --> {academicDepartment, academicFaculty}
  if (newUserAllData) {
    // newUserAllData = await User.findOne({ id: newUserAllData.id });
  }

  return newUserAllData;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
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

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const UserService = {
  createUser,
  getAllUsers,
};

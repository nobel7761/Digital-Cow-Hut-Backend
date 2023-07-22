/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // Check if phoneNumber already exists
    const existingUser = await User.findOne({ phoneNumber: user.phoneNumber });
    if (existingUser) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Duplicate entry for phoneNumber'
      );
    }

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

  const result = await User.findById({ _id: newUserAllData._id }).select(
    '-password'
  );

  return result;
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

const getUserById = async (id: string): Promise<IUser | null> => {
  const result = await User.findOne({ _id: id });
  return result;
};

const updateUserById = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');

  if (payload.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot update 'id' field.");
  }

  const { name, ...updatedData } = payload;

  /*
  const name = {
    firstName: "Rokaiah",
    lastName: "Sumaiah"
  }
  */

  //dynamically handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`; // `name.firstName || name.lastName`
      (updatedData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
  });
  return result;
};

const deleteUserById = async (id: string): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');

  const user = await User.findOneAndDelete({ _id: id });

  return user;
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

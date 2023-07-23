/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { generateUserId } from './user.utils';
import ApiError from '../../../errors/ApiError';
import * as httpStatus from 'http-status';
import {
  ILoginUser,
  ILoginUserResponse,
  IUser,
  IUserFilters,
} from './user.interface';
import { User } from './user.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { userSearchableFields } from './user.constant';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { IRefreshTokenResponse } from '../admin/admin.interface';
import bcrypt from 'bcrypt';

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

const loginUser = async (
  payload: ILoginUser
): Promise<ILoginUserResponse | null> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await User.isUserExistByPhoneNumber(phoneNumber);

  if (!isUserExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User Does Not Exists');

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist?.password))
  )
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password Does Not Match');

  // if user exists and password match then JWT will generate a token witch will be sent from server side to client side. client side will store this token in the browser(localstorage/cookies) so that when user try to login for the next(hit the url) time then user does not need to give id, password again(if the token does not expired) to login. Then we'll send this token with every single request and server will check the token. if the token is authorized then user can make request and then server will give the access through route(so we need to handle this from route level). otherwise user will get failed.

  // create access token & refresh token
  const { _id: userId, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  // verify token
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  // check user is exitst or not. sometimes it may seems that, user is deleted from the database but his/her refresh token is still in there in the browser cookie.
  // checking deleted user's refresh token
  const { userId } = verifiedToken;
  const isAdminExist = await User.isUserExistByID(userId);

  if (!isAdminExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');

  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    { _id: isAdminExist._id, role: isAdminExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
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

const getMyProfile = async (
  id: string,
  role: string
): Promise<IUser | null> => {
  const result = await User.findOne({ _id: id, role: role });

  if (!result)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');

  return result;
};

const updateMyProfile = async (
  id: string,
  role: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id, role: role });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');

  if (payload.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot update 'id' field.");
  }

  const { name, ...updatedData } = payload;

  //dynamically handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`; // `name.firstName || name.lastName`
      (updatedData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (updatedData.password) {
    const hashedPassword = await bcrypt.hash(
      updatedData.password,
      Number(config.bcrypt_salt_rounds)
    );

    updatedData.password = hashedPassword;
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
  });
  return result;
};

export const UserService = {
  createUser,
  loginUser,
  refreshToken,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getMyProfile,
  updateMyProfile,
};

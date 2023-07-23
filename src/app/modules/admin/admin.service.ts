/* eslint-disable @typescript-eslint/no-explicit-any */
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import {
  IAdmin,
  IAdminResponse,
  ILoginAdmin,
  ILoginAdminResponse,
  IRefreshTokenResponse,
} from './admin.interface';
import { Admin } from './admin.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import bcrypt from 'bcrypt';

const createAdmin = async (user: IAdmin): Promise<IAdminResponse | null> => {
  user.role = ENUM_USER_ROLE.ADMIN;
  const result = await Admin.create(user);

  const response = await Admin.findById({ _id: result._id }).select(
    '-password'
  );

  return response;
};

const loginAdmin = async (
  payload: ILoginAdmin
): Promise<ILoginAdminResponse | null> => {
  const { phoneNumber, password } = payload;

  const isAdminExist = await Admin.isAdminExistByPhoneNumber(phoneNumber);

  if (!isAdminExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User Does Not Exists');

  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist?.password))
  )
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password Does Not Match');

  // if user exists and password match then JWT will generate a token witch will be sent from server side to client side. client side will store this token in the browser(localstorage/cookies) so that when user try to login for the next(hit the url) time then user does not need to give id, password again(if the token does not expired) to login. Then we'll send this token with every single request and server will check the token. if the token is authorized then user can make request and then server will give the access through route(so we need to handle this from route level). otherwise user will get failed.

  // create access token & refresh token
  const { _id: userId, role } = isAdminExist;

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
  const isAdminExist = await Admin.isAdminExistByID(userId);

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

const getMyProfile = async (
  id: string,
  role: string
): Promise<IAdmin | null> => {
  const result = await Admin.findOne({ _id: id, role: role });

  if (!result)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');

  return result;
};

const updateMyProfile = async (
  id: string,
  role: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ _id: id, role: role });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Admin Not Found');

  if (payload._id) {
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

  const result = await Admin.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
  });
  return result;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  refreshToken,
  getMyProfile,
  updateMyProfile,
};

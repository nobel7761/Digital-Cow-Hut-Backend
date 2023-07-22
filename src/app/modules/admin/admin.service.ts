import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import {
  IAdmin,
  IAdminResponse,
  ILoginAdmin,
  ILoginAdminResponse,
} from './admin.interface';
import { Admin } from './admin.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

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

  const isAdminExist = await Admin.isAdminExist(phoneNumber);

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

export const AdminService = {
  createAdmin,
  loginAdmin,
};

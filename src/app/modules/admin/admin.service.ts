/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ENUM_USER_ROLE } from '../../../enums/user';
import { IAdmin, IAdminResponse } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (user: IAdmin): Promise<IAdmin> => {
  user.role = ENUM_USER_ROLE.ADMIN;
  const result = await Admin.create(user);

  return result;
};

export const AdminService = {
  createAdmin,
};

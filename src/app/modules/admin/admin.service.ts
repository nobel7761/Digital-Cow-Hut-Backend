import { ENUM_USER_ROLE } from '../../../enums/user';
import { IAdmin, IAdminResponse } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (user: IAdmin): Promise<IAdminResponse | null> => {
  user.role = ENUM_USER_ROLE.ADMIN;
  const result = await Admin.create(user);

  const response = await Admin.findById({ _id: result._id }).select(
    '-password'
  );

  return response;
};

export const AdminService = {
  createAdmin,
};

import { ENUM_USER_ROLE } from '../../../enums/user';

export const roles = [ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER];

export const userFilterableFields = ['searchTerm', 'id', 'role'];

export const userSearchableFields = [
  'id',
  'role',
  'phoneNumber',
  'name.firstName',
  'name.lastName',
  'address',
  'budget',
  'income',
];

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.userSearchableFields =
  exports.userFilterableFields =
  exports.roles =
    void 0;
const user_1 = require('../../../enums/user');
exports.roles = [user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER];
exports.userFilterableFields = ['searchTerm', 'id', 'role'];
exports.userSearchableFields = [
  'id',
  'role',
  'phoneNumber',
  'name.firstName',
  'name.lastName',
  'address',
  'budget',
  'income',
];

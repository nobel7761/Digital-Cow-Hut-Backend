'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require('mongoose'));
const user_utils_1 = require('./user.utils');
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const httpStatus = __importStar(require('http-status'));
const user_model_1 = require('./user.model');
const user_constant_1 = require('./user.constant');
const paginationHelpers_1 = require('../../../helpers/paginationHelpers');
const createUser = user =>
  __awaiter(void 0, void 0, void 0, function* () {
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
      session.startTransaction();
      const id = yield (0, user_utils_1.generateUserId)();
      user.id = id;
      // Check if phoneNumber already exists
      const existingUser = yield user_model_1.User.findOne({
        phoneNumber: user.phoneNumber,
      });
      if (existingUser) {
        throw new ApiError_1.default(
          httpStatus.BAD_REQUEST,
          'Duplicate entry for phoneNumber'
        );
      }
      //create user
      const newUser = yield user_model_1.User.create([user], { session });
      if (!newUser.length) {
        throw new ApiError_1.default(
          httpStatus.BAD_REQUEST,
          'Failed to create user'
        );
      }
      newUserAllData = newUser[0];
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
    return newUserAllData;
  });
const getAllUsers = (filters, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters,
      filtersData = __rest(filters, ['searchTerm']);
    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        $or: user_constant_1.userSearchableFields.map(field => ({
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
      paginationHelpers_1.paginationHelpers.calculatePagination(
        paginationOptions
      );
    //making an object by which sorting will be retrieved!
    const sortConditions = {};
    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }
    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield user_model_1.User.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);
    const total = yield user_model_1.User.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  });
const getUserById = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ _id: id });
    return result;
  });
const updateUserById = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ _id: id });
    if (!isExist)
      throw new ApiError_1.default(httpStatus.NOT_FOUND, 'User Not Found');
    if (payload.id) {
      throw new ApiError_1.default(
        httpStatus.BAD_REQUEST,
        "Cannot update 'id' field."
      );
    }
    const { name } = payload,
      updatedData = __rest(payload, ['name']);
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
        updatedData[nameKey] = name[key];
      });
    }
    const result = yield user_model_1.User.findOneAndUpdate(
      { _id: id },
      updatedData,
      {
        new: true,
      }
    );
    return result;
  });
const deleteUserById = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ _id: id });
    if (!isExist)
      throw new ApiError_1.default(httpStatus.NOT_FOUND, 'User Not Found');
    const user = yield user_model_1.User.findOneAndDelete({ _id: id });
    return user;
  });
exports.UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

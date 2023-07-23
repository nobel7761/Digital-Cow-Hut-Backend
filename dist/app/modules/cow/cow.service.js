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
exports.CowService = void 0;
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const httpStatus = __importStar(require('http-status'));
const cow_model_1 = require('./cow.model');
const cow_constant_1 = require('./cow.constant');
const paginationHelpers_1 = require('../../../helpers/paginationHelpers');
const createCow = cow =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.create(cow);
    return result;
  });
const getAllCows = (filters, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, minPrice, maxPrice } = filters,
      filtersData = __rest(filters, ['searchTerm', 'minPrice', 'maxPrice']);
    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        $or: cow_constant_1.cowSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      });
    }
    if (minPrice !== undefined) {
      andConditions.push({ price: { $gte: minPrice } });
    }
    if (maxPrice !== undefined) {
      andConditions.push({ price: { $lte: maxPrice } });
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
    const result = yield cow_model_1.Cow.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);
    const total = yield cow_model_1.Cow.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  });
const getCowById = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findOne({ _id: id });
    return result;
  });
const updateCowById = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findOne({ _id: id });
    if (!isExist)
      throw new ApiError_1.default(httpStatus.NOT_FOUND, 'Cow Not Found');
    const result = yield cow_model_1.Cow.findOneAndUpdate(
      { _id: id },
      payload,
      {
        new: true,
      }
    );
    return result;
  });
const deleteCowById = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findOne({ _id: id });
    if (!isExist)
      throw new ApiError_1.default(httpStatus.NOT_FOUND, 'Cow Not Found');
    const cow = yield cow_model_1.Cow.findOneAndDelete({ _id: id });
    return cow;
  });
exports.CowService = {
  createCow,
  getAllCows,
  getCowById,
  updateCowById,
  deleteCowById,
};

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const user_utils_1 = require("./user.utils");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const httpStatus = __importStar(require("http-status"));
const user_model_1 = require("./user.model");
const user_constant_1 = require("./user.constant");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const id = yield (0, user_utils_1.generateUserId)();
        user.id = id;
        // Check if phoneNumber already exists
        const existingUser = yield user_model_1.User.findOne({ phoneNumber: user.phoneNumber });
        if (existingUser) {
            throw new ApiError_1.default(httpStatus.BAD_REQUEST, 'Duplicate entry for phoneNumber');
        }
        //create user
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(httpStatus.BAD_REQUEST, 'Failed to create user');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    const result = yield user_model_1.User.findById({ _id: newUserAllData._id }).select('-password');
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isUserExist = yield user_model_1.User.isUserExistByPhoneNumber(phoneNumber);
    if (!isUserExist)
        throw new ApiError_1.default(httpStatus.NOT_FOUND, 'User Does Not Exists');
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatched(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password)))
        throw new ApiError_1.default(httpStatus.UNAUTHORIZED, 'Password Does Not Match');
    // if user exists and password match then JWT will generate a token witch will be sent from server side to client side. client side will store this token in the browser(localstorage/cookies) so that when user try to login for the next(hit the url) time then user does not need to give id, password again(if the token does not expired) to login. Then we'll send this token with every single request and server will check the token. if the token is authorized then user can make request and then server will give the access through route(so we need to handle this from route level). otherwise user will get failed.
    // create access token & refresh token
    const { _id: userId, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    // verify token
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
    }
    // check user is exitst or not. sometimes it may seems that, user is deleted from the database but his/her refresh token is still in there in the browser cookie.
    // checking deleted user's refresh token
    const { userId } = verifiedToken;
    const isAdminExist = yield user_model_1.User.isUserExistByID(userId);
    if (!isAdminExist)
        throw new ApiError_1.default(httpStatus.NOT_FOUND, 'User does not exist');
    //generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ _id: isAdminExist._id, role: isAdminExist.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
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
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    //making an object by which sorting will be retrieved!
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
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
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ _id: id });
    return result;
});
const updateUserById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ _id: id });
    if (!isExist)
        throw new ApiError_1.default(httpStatus.NOT_FOUND, 'User Not Found');
    if (payload.id) {
        throw new ApiError_1.default(httpStatus.BAD_REQUEST, "Cannot update 'id' field.");
    }
    const { name } = payload, updatedData = __rest(payload, ["name"]);
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
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, updatedData, {
        new: true,
    });
    return result;
});
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ _id: id });
    if (!isExist)
        throw new ApiError_1.default(httpStatus.NOT_FOUND, 'User Not Found');
    const user = yield user_model_1.User.findOneAndDelete({ _id: id });
    return user;
});
const getMyProfile = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ _id: id, role: role });
    if (!result)
        throw new ApiError_1.default(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    return result;
});
const updateMyProfile = (id, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ _id: id, role: role });
    if (!isExist)
        throw new ApiError_1.default(httpStatus.NOT_FOUND, 'User Not Found');
    if (payload.id) {
        throw new ApiError_1.default(httpStatus.BAD_REQUEST, "Cannot update 'id' field.");
    }
    const { name } = payload, updatedData = __rest(payload, ["name"]);
    //dynamically handling
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`; // `name.firstName || name.lastName`
            updatedData[nameKey] = name[key];
        });
    }
    if (updatedData.password) {
        const hashedPassword = yield bcrypt_1.default.hash(updatedData.password, Number(config_1.default.bcrypt_salt_rounds));
        updatedData.password = hashedPassword;
    }
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, updatedData, {
        new: true,
    });
    return result;
});
exports.UserService = {
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

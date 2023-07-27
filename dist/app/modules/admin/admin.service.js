"use strict";
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
exports.AdminService = void 0;
const config_1 = __importDefault(require("../../../config"));
const user_1 = require("../../../enums/user");
const admin_model_1 = require("./admin.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAdmin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.role = user_1.ENUM_USER_ROLE.ADMIN;
    const result = yield admin_model_1.Admin.create(user);
    const response = yield admin_model_1.Admin.findById({ _id: result._id }).select('-password');
    return response;
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isAdminExist = yield admin_model_1.Admin.isAdminExistByPhoneNumber(phoneNumber);
    if (!isAdminExist)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User Does Not Exists');
    if (isAdminExist.password &&
        !(yield admin_model_1.Admin.isPasswordMatched(password, isAdminExist === null || isAdminExist === void 0 ? void 0 : isAdminExist.password)))
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password Does Not Match');
    // if user exists and password match then JWT will generate a token witch will be sent from server side to client side. client side will store this token in the browser(localstorage/cookies) so that when user try to login for the next(hit the url) time then user does not need to give id, password again(if the token does not expired) to login. Then we'll send this token with every single request and server will check the token. if the token is authorized then user can make request and then server will give the access through route(so we need to handle this from route level). otherwise user will get failed.
    // create access token & refresh token
    const { _id: userId, role } = isAdminExist;
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
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // check user is exitst or not. sometimes it may seems that, user is deleted from the database but his/her refresh token is still in there in the browser cookie.
    // checking deleted user's refresh token
    const { userId } = verifiedToken;
    const isAdminExist = yield admin_model_1.Admin.isAdminExistByID(userId);
    if (!isAdminExist)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    //generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ _id: isAdminExist._id, role: isAdminExist.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const getMyProfile = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.Admin.findOne({ _id: id, role: role });
    if (!result)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
    return result;
});
const updateMyProfile = (id, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield admin_model_1.Admin.findOne({ _id: id, role: role });
    if (!isExist)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin Not Found');
    if (payload._id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot update 'id' field.");
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
    const result = yield admin_model_1.Admin.findOneAndUpdate({ _id: id }, updatedData, {
        new: true,
    });
    return result;
});
exports.AdminService = {
    createAdmin,
    loginAdmin,
    refreshToken,
    getMyProfile,
    updateMyProfile,
};

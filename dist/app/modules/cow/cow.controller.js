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
exports.CowController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const cow_constant_1 = require("./cow.constant");
const cow_service_1 = require("./cow.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cowData = __rest(req.body, []);
    const result = yield cow_service_1.CowService.createCow(cowData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cow created successfully',
        data: result,
    });
}));
const getAllCows = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, cow_constant_1.cowFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    // // Parse minPrice and maxPrice from the request query parameters
    // const minPrice = req.query.minPrice
    // const maxPrice = req.query.maxPrice
    // // Add minPrice and maxPrice filters to the filters object
    // if (!isNaN(minPrice)) {
    //   filters.minPrice = minPrice.toString();
    // }
    // if (!isNaN(maxPrice)) {
    //   filters.maxPrice = maxPrice.toString();
    // }
    const result = yield cow_service_1.CowService.getAllCows(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cows Retrieved Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getCowById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield cow_service_1.CowService.getCowById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Cow retrieved successfully',
        data: result,
    });
}));
const updateCowById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const updatedData = req.body;
    const accessToken = req.headers.authorization;
    const decodedToken = jsonwebtoken_1.default.decode(accessToken, { complete: true });
    const sellerId = (_a = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.payload) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield cow_service_1.CowService.updateCowById(id, sellerId, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cow updated successfully',
        data: result,
    });
}));
const deleteCowById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = req.params.id;
    const accessToken = req.headers.authorization;
    const decodedToken = jsonwebtoken_1.default.decode(accessToken, { complete: true });
    const sellerId = (_b = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.payload) === null || _b === void 0 ? void 0 : _b.userId;
    const result = yield cow_service_1.CowService.deleteCowById(id, sellerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cow deleted successfully',
        data: result,
    });
}));
exports.CowController = {
    createCow,
    getAllCows,
    getCowById,
    updateCowById,
    deleteCowById,
};

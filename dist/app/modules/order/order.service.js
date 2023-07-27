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
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const order_model_1 = require("./order.model");
const order_constant_1 = require("./order.constant");
const user_model_1 = require("../user/user.model");
const cow_model_1 = require("../cow/cow.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const cow_constant_1 = require("../cow/cow.constant");
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    let newOrderAllData = null;
    const buyer = yield user_model_1.User.findById({ _id: order.buyer });
    const cow = yield cow_model_1.Cow.findById({ _id: order.cow });
    const seller = yield user_model_1.User.findById({ _id: cow === null || cow === void 0 ? void 0 : cow.seller });
    const cowPrice = cow ? cow.price : null;
    const buyerBudget = buyer ? buyer.budget : null;
    // if (!cow) {
    //   throw new ApiError(httpStatus.NOT_FOUND, 'Cow Does Not Exists');
    // }
    if (cow !== null && cow.label === cow_constant_1.label[1]) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'This Cow Already Sold Out! You Cannot Purchase This Cow');
    }
    if (buyer && buyer.role !== 'buyer') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong Request! Provided Buyer ID Does Not Exists!');
    }
    if (cowPrice !== null && buyerBudget !== null && cowPrice > buyerBudget) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Buyer Does Not Have Sufficient Balance To Purchase');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (cow !== null &&
            buyer !== null &&
            seller !== null &&
            cowPrice !== null) {
            cow.label = cow_constant_1.label[1];
            buyer.budget = buyer.budget - cowPrice;
            seller.income = seller.income + cowPrice;
            const updatedBuyerBudget = { budget: buyer.budget };
            const updatedSellerIncome = { income: seller.income };
            const updatedCowLabel = { label: cow.label };
            yield user_model_1.User.findByIdAndUpdate({ _id: order.buyer }, updatedBuyerBudget, {
                new: true,
            });
            yield user_model_1.User.findByIdAndUpdate({ _id: cow.seller }, updatedSellerIncome, {
                new: true,
            });
            yield cow_model_1.Cow.findByIdAndUpdate({ _id: order.cow }, updatedCowLabel, {
                new: true,
            });
        }
        const newOrder = yield order_model_1.Order.create([order], { session });
        if (!newOrder) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create order');
        }
        newOrderAllData = yield newOrder[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    const result = yield order_model_1.Order.findOne({ _id: newOrderAllData._id })
        .populate({
        path: 'cow',
        populate: [{ path: 'seller' }],
    })
        .populate('buyer');
    return result;
});
const getAllOrders = (userId, role, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: order_constant_1.orderSearchableFields.map(field => ({
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
    // Adding the role-based condition for buyer
    if (role === 'buyer') {
        andConditions.push({
            $and: [
                {
                    buyer: userId,
                },
            ],
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    //making an object by which sorting will be retrieved!
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    let result;
    let total = 0;
    if (role === 'admin') {
        result = yield order_model_1.Order.find(whereConditions)
            .populate({ path: 'cow', populate: [{ path: 'seller' }] })
            .populate('buyer')
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        total = yield order_model_1.Order.countDocuments(whereConditions);
    }
    if (role === 'buyer') {
        result = yield order_model_1.Order.find(whereConditions)
            .populate({ path: 'cow', populate: [{ path: 'seller' }] })
            .populate('buyer')
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        total = yield order_model_1.Order.countDocuments(whereConditions);
    }
    if (role === 'seller') {
        const orders = yield order_model_1.Order.find({})
            .populate({ path: 'cow', populate: [{ path: 'seller' }] })
            .populate('buyer')
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        result = orders.filter(order => {
            var _a, _b, _c;
            // Check if order.cow is of type ICow
            if ('seller' in order.cow) {
                const sellerId = (_c = (_b = (_a = order.cow) === null || _a === void 0 ? void 0 : _a.seller) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString();
                return sellerId === userId;
            }
            return false; // Handle the case when order.cow is an ObjectId (or anything else)
        });
        total = result.length;
    }
    if (!result)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getOrderById = (orderId, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === 'buyer') {
        result = yield order_model_1.Order.findOne({ _id: orderId, buyer: userId })
            .populate({
            path: 'cow',
            populate: [{ path: 'seller' }],
        })
            .populate('buyer');
    }
    if (role === 'seller') {
        result = yield order_model_1.Order.findById({ _id: orderId, 'cow.seller._id': userId })
            .populate({
            path: 'cow',
            populate: [{ path: 'seller' }],
        })
            .populate('buyer');
    }
    return result;
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
};

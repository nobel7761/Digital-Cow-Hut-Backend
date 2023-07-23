import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IOrder, IOrderFilters } from './order.interface';
import { Order } from './order.model';
import { orderSearchableFields } from './order.constant';
import { User } from '../user/user.model';
import { Cow } from '../cow/cow.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { label } from '../cow/cow.constant';

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  let newOrderAllData = null;

  const buyer = await User.findById({ _id: order.buyer });
  const cow = await Cow.findById({ _id: order.cow });
  const seller = await User.findById({ _id: cow?.seller });

  const cowPrice: number | null = cow ? cow.price : null;
  const buyerBudget: number | null = buyer ? buyer.budget : null;

  if (cow !== null && cow.label === label[1]) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This Cow Already Sold Out! You Cannot Purchase This Cow'
    );
  }

  if (cowPrice !== null && buyerBudget !== null && cowPrice > buyerBudget) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Buyer Does Not Have Sufficient Balance To Purchase'
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (
      cow !== null &&
      buyer !== null &&
      seller !== null &&
      cowPrice !== null
    ) {
      cow.label = label[1];
      buyer.budget = buyer.budget - cowPrice;
      seller.income = seller.income + cowPrice;

      const updatedBuyerBudget = { budget: buyer.budget };
      const updatedSellerIncome = { income: seller.income };
      const updatedCowLabel = { label: cow.label };

      await User.findByIdAndUpdate({ _id: order.buyer }, updatedBuyerBudget, {
        new: true,
      });
      await User.findByIdAndUpdate({ _id: cow.seller }, updatedSellerIncome, {
        new: true,
      });
      await Cow.findByIdAndUpdate({ _id: order.cow }, updatedCowLabel, {
        new: true,
      });
    }

    const newOrder = await Order.create([order], { session });

    if (!newOrder.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create order');
    }

    // Use findOne() with lean() option to get the plain JavaScript object
    const populatedOrder = await Order.findOne({ _id: newOrder[0]._id })
      .populate('cow')
      .populate('buyer')
      .lean()
      .exec();

    newOrderAllData = populatedOrder;

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();

    await session.endSession();

    throw error;
  }

  return newOrderAllData;
};

const getAllOrders = async (
  userId: string,
  role: string,
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableFields.map(field => ({
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

  // Adding the role-based condition for sellers
  if (role === 'buyer') {
    andConditions.push({
      $and: [
        {
          buyer: userId,
        },
      ],
    });
  }

  // if (role === 'seller') {
  //   andConditions.push({
  //     $and: [
  //       {
  //         buyer: userId,
  //       },
  //     ],
  //   });
  // }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  //making an object by which sorting will be retrieved!
  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Order.find(whereConditions)
    .populate('cow')
    .populate('buyer')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  if (!result)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');

  const total = await Order.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const OrderService = {
  createOrder,
  getAllOrders,
};

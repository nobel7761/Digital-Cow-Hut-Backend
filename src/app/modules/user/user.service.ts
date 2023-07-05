// /* eslint-disable no-unused-expressions */
// import mongoose from 'mongoose';
// import { generateBuyerId, generateSellerId } from './user.utils';
// import ApiError from '../../../errors/ApiError';
// import httpStatus from 'http-status';

// const createUser = async (user: IUser): Promise<IUser | null> => {
//   let newUserAllData = null;
//   let seller = { ...user };
//   let buyer = { ...user };
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const id =
//       (await user.role) === 'seller' ? generateSellerId() : generateBuyerId();

//     user.id = id;
//     user.role === 'seller' ? (seller.id = id) : (buyer.id = id);
//     user.role === 'buyer' ? (buyer.income = 0) : undefined;

//     //create seller
//     const newSeller = await Seller.create([seller], { session });
//     if (!newSeller.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Seller');
//     }

//     //create buyer
//     const newBuyer = await Buyer.create([buyer], { session });
//     if (!newBuyer.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Buyer');
//     }

//     //create user
//     user.role === 'seller'
//       ? (user.seller = newSeller[0]._id)
//       : (user.buyer = newBuyer[0]._id);

//     const newUser = await User.create([user], { session });

//     if (!newUser.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
//     }

//     newUserAllData = newUser[0];

//     await session.commitTransaction();
//     await session.endSession();
//   } catch (error) {
//     await session.abortTransaction();

//     await session.endSession();

//     throw error;
//   }

//   //user --> faculty --> {academicDepartment, academicFaculty}
//   if (newUserAllData) {
//     // newUserAllData = await User.findOne({ id: newUserAllData.id });
//   }

//   return newUserAllData;
// };

// export const UserService = {
//   createUser,
// };

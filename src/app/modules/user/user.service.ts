// /* eslint-disable no-unused-expressions */
// import mongoose from 'mongoose';
// import { generateUserId } from './user.utils';
// import ApiError from '../../../errors/ApiError';
// import * as httpStatus from 'http-status';

// import { IUser } from './user.interface';
// import { User } from './user.model';

// const createUser = async (user: IUser): Promise<IUser | null> => {
//   let newUserAllData = null;
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const id = await generateUserId();

//     user.id = id;

//     //create user
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

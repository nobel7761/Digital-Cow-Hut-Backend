import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import { UserController } from './user.controller';

const router = express.Router();

// create user
router.post(
  '/auth/signup',
  validateRequest(userValidation.createUserZodSchema),
  UserController.createUser
);

// login user
router.post(
  '/auth/login',
  validateRequest(userValidation.loginZodSchema),
  UserController.loginUser
);

// create new access token
router.post(
  '/auth/refresh-token',
  validateRequest(userValidation.refreshTokenZodSchema),
  UserController.refreshToken
);

//get all users
router.get('/users', UserController.getAllUsers);

//get user by id
router.get('/users/:id', UserController.getUserById);

//delete user by id
router.delete('/users/:id', UserController.deleteUserById);

//update user by id
router.patch(
  '/users/:id',
  validateRequest(userValidation.updateUserZodSchema),
  UserController.updateUserById
);

export const UserRoutes = router;

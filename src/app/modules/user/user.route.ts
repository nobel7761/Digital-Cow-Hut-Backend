import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import { UserController } from './user.controller';

const router = express.Router();

router.post(
  '/auth/signup',
  validateRequest(userValidation.createUserZodSchema),
  UserController.createUser
);

router.get('/users', UserController.getAllUsers);

router.get('/users/:id', UserController.getUserById);

router.delete('/users/:id', UserController.deleteUserById);

router.patch(
  '/users/:id',
  validateRequest(userValidation.updateUserZodSchema),
  UserController.updateUserById
);

export const UserRoutes = router;

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

export const UserRoutes = router;

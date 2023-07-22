import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();

// create admin
router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);

// login admin
router.post(
  '/login',
  validateRequest(AdminValidation.loginZodSchema),
  AdminController.loginAdmin
);

// create new access token
router.post(
  '/refresh-token',
  validateRequest(AdminValidation.refreshTokenZodSchema),
  AdminController.refreshToken
);

export const AdminRoutes = router;

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const route = express.Router();

route.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);

export const AdminRoutes = route;

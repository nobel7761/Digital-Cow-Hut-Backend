import express from 'express';
import { OrderController } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { orderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(orderValidation.createOrderZodSchema),
  OrderController.createOrder
);

router.get('/', OrderController.getAllOrders);

export const OrderRoutes = router;

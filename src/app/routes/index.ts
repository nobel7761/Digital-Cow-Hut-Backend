import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { OrderRoutes } from '../modules/order/order.route';
import { AdminRoutes } from '../modules/admin/admin.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/cows',
    routes: CowRoutes,
  },
  {
    path: '/orders',
    routes: OrderRoutes,
  },
  {
    path: '/admins',
    routes: AdminRoutes,
  },
  {
    path: '/',
    routes: UserRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));

export default router;

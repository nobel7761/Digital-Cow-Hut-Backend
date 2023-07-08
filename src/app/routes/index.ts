import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { CowRoutes } from '../modules/cow/cow.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/cows',
    routes: CowRoutes,
  },
  {
    path: '/',
    routes: UserRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));

export default router;

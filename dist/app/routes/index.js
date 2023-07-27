"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const cow_route_1 = require("../modules/cow/cow.route");
const order_route_1 = require("../modules/order/order.route");
const admin_route_1 = require("../modules/admin/admin.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/cows',
        routes: cow_route_1.CowRoutes,
    },
    {
        path: '/orders',
        routes: order_route_1.OrderRoutes,
    },
    {
        path: '/admins',
        routes: admin_route_1.AdminRoutes,
    },
    {
        path: '/',
        routes: user_route_1.UserRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.routes));
exports.default = router;

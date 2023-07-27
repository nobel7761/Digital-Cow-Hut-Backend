"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
//get my profile
router.get('/users/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), user_controller_1.UserController.getMyProfile);
// create user
router.post('/auth/signup', (0, validateRequest_1.default)(user_validation_1.userValidation.createUserZodSchema), user_controller_1.UserController.createUser);
// login user
router.post('/auth/login', (0, validateRequest_1.default)(user_validation_1.userValidation.loginZodSchema), user_controller_1.UserController.loginUser);
// create new access token
router.post('/auth/refresh-token', (0, validateRequest_1.default)(user_validation_1.userValidation.refreshTokenZodSchema), user_controller_1.UserController.refreshToken);
//get all users
router.get('/users', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers);
//get user by id
router.get('/users/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getUserById);
//delete user by id
router.delete('/users/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.deleteUserById);
router.patch('/users/my-profile', (0, validateRequest_1.default)(user_validation_1.userValidation.updateUserZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), user_controller_1.UserController.updateMyProfile);
//update user by id
router.patch('/users/:id', (0, validateRequest_1.default)(user_validation_1.userValidation.updateUserZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.updateUserById);
exports.UserRoutes = router;

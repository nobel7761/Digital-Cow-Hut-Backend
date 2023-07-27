"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_controller_1 = require("./admin.controller");
const admin_validation_1 = require("./admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
//get my profile
router.get('/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getMyProfile);
// create admin
router.post('/create-admin', (0, validateRequest_1.default)(admin_validation_1.AdminValidation.createAdminZodSchema), admin_controller_1.AdminController.createAdmin);
// login admin
router.post('/login', (0, validateRequest_1.default)(admin_validation_1.AdminValidation.loginZodSchema), admin_controller_1.AdminController.loginAdmin);
// create new access token
router.post('/refresh-token', (0, validateRequest_1.default)(admin_validation_1.AdminValidation.refreshTokenZodSchema), admin_controller_1.AdminController.refreshToken);
//update my profile
router.patch('/my-profile', (0, validateRequest_1.default)(admin_validation_1.AdminValidation.updateAdminZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.updateMyProfile);
exports.AdminRoutes = router;

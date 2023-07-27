"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number is Required!' }),
        role: zod_1.z.string({ required_error: 'Role is Required!' }),
        password: zod_1.z.string({ required_error: 'Password is Required!' }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First Name is Required!' }),
            lastName: zod_1.z.string({ required_error: 'Last Name is Required!' }),
        }),
        address: zod_1.z.string({ required_error: 'Address is Required!' }),
    }),
});
const updateAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string().optional(),
        role: zod_1.z.string().optional(),
        password: zod_1.z.string().optional(),
        name: zod_1.z.object({
            firstName: zod_1.z.string().optional(),
            lastName: zod_1.z.string().optional(),
        }),
        address: zod_1.z.string().optional(),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number is required!' }),
        password: zod_1.z.string({ required_error: 'Password is required!' }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh Token is required!' }),
    }),
});
exports.AdminValidation = {
    createAdminZodSchema,
    updateAdminZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
};

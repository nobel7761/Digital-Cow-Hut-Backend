"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: 'Password is required!' }),
        role: zod_1.z.enum([...user_constant_1.roles], {
            required_error: 'Role is required!',
        }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First Name is required!' }),
            lastName: zod_1.z.string({ required_error: 'Last Name is required!' }),
        }),
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number is required!' }),
        address: zod_1.z.string({ required_error: 'Address is required!' }),
        budget: zod_1.z.number({ required_error: 'Budget is required!' }),
        income: zod_1.z.number({ required_error: 'Income is required!' }),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        role: zod_1.z.enum([...user_constant_1.roles]).optional(),
        name: zod_1.z
            .object({
            firstName: zod_1.z.string().optional(),
            lastName: zod_1.z.string().optional(),
        })
            .optional(),
        phoneNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        budget: zod_1.z.number().optional(),
        income: zod_1.z.number().optional(),
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
exports.userValidation = {
    createUserZodSchema,
    updateUserZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
};

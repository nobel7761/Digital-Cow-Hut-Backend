import { z } from 'zod';
import { roles } from './user.constant';

const createUserZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'Password is required!' }),
    role: z.enum([...roles] as [string, ...string[]], {
      required_error: 'Role is required!',
    }),
    name: z.object({
      firstName: z.string({ required_error: 'First Name is required!' }),
      lastName: z.string({ required_error: 'Last Name is required!' }),
    }),
    phoneNumber: z.string({ required_error: 'Phone Number is required!' }),
    address: z.string({ required_error: 'Address is required!' }),
    budget: z.number({ required_error: 'Budget is required!' }),
    income: z.number({ required_error: 'Income is required!' }),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    role: z.enum([...roles] as [string, ...string[]]).optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone Number is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token is required!' }),
  }),
});

export const userValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
};

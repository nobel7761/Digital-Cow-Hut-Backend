import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone Number is Required!' }),
    role: z.string({ required_error: 'Role is Required!' }),
    password: z.string({ required_error: 'Password is Required!' }),
    name: z.object({
      firstName: z.string({ required_error: 'First Name is Required!' }),
      lastName: z.string({ required_error: 'Last Name is Required!' }),
    }),
    address: z.string({ required_error: 'Address is Required!' }),
  }),
});

const updateAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string().optional(),
    role: z.string().optional(),
    password: z.string().optional(),
    name: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
    address: z.string().optional(),
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

export const AdminValidation = {
  createAdminZodSchema,
  updateAdminZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
};

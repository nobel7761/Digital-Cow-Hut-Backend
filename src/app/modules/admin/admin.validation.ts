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

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone Number is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
  loginZodSchema,
};

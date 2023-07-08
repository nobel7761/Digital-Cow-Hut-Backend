import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({ required_error: 'Cow ID is required.' }),
    buyer: z.string({ required_error: 'Buyer ID is required.' }),
  }),
});

export const orderValidation = {
  createOrderZodSchema,
};

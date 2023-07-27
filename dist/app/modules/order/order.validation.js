"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const zod_1 = require("zod");
const createOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        cow: zod_1.z.string({ required_error: 'Cow ID is required.' }),
        buyer: zod_1.z.string({ required_error: 'Buyer ID is required.' }),
    }),
});
exports.orderValidation = {
    createOrderZodSchema,
};

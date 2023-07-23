'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
const mongoose_1 = require('mongoose');
const userSchema = new mongoose_1.Schema(
  {
    id: { type: String, required: true, unique: true, immutable: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  {
    timestamps: true, //for getting the createdAt, updatedAt from mongoose
  }
);
exports.User = (0, mongoose_1.model)('User', userSchema);

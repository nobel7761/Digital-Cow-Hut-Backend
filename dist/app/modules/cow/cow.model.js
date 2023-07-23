'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Cow = void 0;
const mongoose_1 = require('mongoose');
const cowSchema = new mongoose_1.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    breed: { type: String, required: true },
    weight: { type: Number, required: true },
    label: { type: String, required: true },
    category: { type: String, required: true },
    seller: { type: String, required: true },
  },
  {
    timestamps: true, //for getting the createdAt, updatedAt from mongoose
  }
);
exports.Cow = (0, mongoose_1.model)('Cow', cowSchema);

'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const http_status_1 = __importDefault(require('http-status'));
const handleCastError = error => {
  const errors = [
    {
      path: error === null || error === void 0 ? void 0 : error.path,
      message: 'Invalid ID',
    },
  ];
  const statusCode = http_status_1.default.BAD_REQUEST; //400
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};
exports.default = handleCastError;

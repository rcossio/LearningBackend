import enumError from '../enum/enumError.js';

class CustomError extends Error {
  constructor(message, errorType) {
    super(message);
    this.name = 'CustomError';
    this.errorCode = enumError[errorType] || 9;
    this.date = new Date().toLocaleString();
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;

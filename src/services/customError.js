class CustomError {

  static createError(name, cause, message, errorCode=1) {
    const error = new Error(message);
    error.name = name;
    error.cause = cause;
    error.errorCode = errorCode;
    console.log("CustomError: ", error);
    throw error;
  }

}

export default CustomError;
import CustomError from '../services/customError.js';

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        console.error(err);
    } else {
        console.error(new CustomError(err.message, 'UNKNOWN_ERROR'));
    }
    
    next();
};

export default errorHandler;
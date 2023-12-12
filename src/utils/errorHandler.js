import CustomError from '../services/customError.js';
import logger from './logger.js'

const formatErrorMessage = (err) => `${err.message} (Code: ${err.errorCode}) \n Stack: ${err.stack}`;

const logError = (err) => {
    if (err instanceof CustomError) {
        logger.error(formatErrorMessage(err));
        throw err;
    } else {
        const unknownError = new CustomError(err.message, 'UNKNOWN_ERROR');
        logger.error(formatErrorMessage(unknownError));
        throw unknownError;
    }
}

export default logError;

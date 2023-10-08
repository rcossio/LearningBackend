import CustomError from '../services/customError.js';
import logger from './logger.js'

const formatErrorMessage = (err) => `${err.message} (Code: ${err.errorCode}) \n Stack: ${err.stack}`;

const handleAndLogError = (err) => {
    if (err instanceof CustomError) {
        logger.error(formatErrorMessage(err));
        return err;
    } else {
        const unknownError = new CustomError(err.message, 'UNKNOWN_ERROR');
        logger.error(formatErrorMessage(unknownError));
        return unknownError;
    }
}

export default handleAndLogError;

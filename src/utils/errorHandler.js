import CustomError from '../services/customError.js';

const handleAndLogError = (err) => {
    if (err instanceof CustomError) {
        console.error(err);
        return err;
    } else {
        const unknownError = new CustomError(err.message, 'UNKNOWN_ERROR');
        console.error(unknownError);
        return unknownError;
    }
}

export default handleAndLogError;

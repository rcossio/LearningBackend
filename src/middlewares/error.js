import { enumError } from "../enum/enumError.js";

const errorHandler = (err,req,res,next) => {
  switch (err.code){
    case enumError.ROUTING_ERROR:
      res.status(500).json({ status: 'error', payload: err });
    case enumError.DB_ERROR:
      res.status(500).json({ status: 'error', payload: err });
    case enumError.AUTH_ERROR:
      res.status(500).json({ status: 'error', payload: err });
    case enumError.INVALID_JSON:
      res.status(500).json({ status: 'error', payload: err });
    default:
      res.status(500).json({ status: 'error', payload: err });      
  }
}

export default errorHandler;
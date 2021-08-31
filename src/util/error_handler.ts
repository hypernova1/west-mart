import { Response } from 'express';
import RequestError from '@error/request_error';

const errorHandler = (res: Response, error: RequestError): Response => {
  return res.status(error.status).json({ message: error.message });
};

export default errorHandler;

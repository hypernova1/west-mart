import { Response } from 'express';
import RequestError from '@error/request_error';

export default function errorHandler(res: Response, error: RequestError) {
  return res.status(error.status).json({ message: error.message });
}

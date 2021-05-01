import { Response } from 'express';
import ResponseEntity from '@payload/response_entity';

export default function errorHandler(res: Response, responseEntity: ResponseEntity) {
    return res.status(responseEntity.status).json({ message: responseEntity.body })
}
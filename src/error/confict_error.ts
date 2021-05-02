import HttpStatus from '@constant/http_status';
import RequestError from './request_error';

export default class ConflictError extends RequestError {

    constructor(message: string) {
        super(HttpStatus.CONFLICT, message);
    }
}
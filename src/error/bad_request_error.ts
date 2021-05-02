import HttpStatus from '@constant/http_status';
import RequestError from './request_error';

export default class BadRequestError extends RequestError {

    constructor(message: string) {
        super(HttpStatus.BAD_REQUEST, message);
        super.status = HttpStatus.BAD_REQUEST;
        super.message = message;
    }
}
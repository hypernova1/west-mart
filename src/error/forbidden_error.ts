import HttpStatus from '@constant/http_status';
import RequestError from './request_error';

export default class ForbiddenError extends RequestError {

    constructor(message: string) {
        super(HttpStatus.FORBIDDEN, message);
        super.status = HttpStatus.FORBIDDEN;
        super.message = message;
    }
}
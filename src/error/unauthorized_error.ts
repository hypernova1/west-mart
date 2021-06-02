import HttpStatus from '@constant/http_status';
import RequestError from './request_error';

export default class UnauthorizedError extends RequestError {

    constructor(message: string) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}
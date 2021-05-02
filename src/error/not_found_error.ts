import HttpStatus from '@constant/http_status';
import RequestError from './request_error';

export default class NotFoundError extends RequestError {

    constructor(message: string) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
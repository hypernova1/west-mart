import HttpStatus from '@constant/http_status';

export default class RequestError extends Error {

    status: HttpStatus;
    message: string;

    constructor(status: HttpStatus, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
import HttpStatus from '@constant/http_status';

export default class ResponseEntity {
    status: HttpStatus;
    message: string;

    static create(status: HttpStatus, message: string): ResponseEntity {
        return { status, message };
    }
}

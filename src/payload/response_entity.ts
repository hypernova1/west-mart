import HttpStatus from '@constant/http_status';

export default class ResponseEntity {
    status: HttpStatus;
    static create(status: HttpStatus, body: object): ResponseEntity {
        return { status, body } as ResponseEntity;
    }

    body: object;

    static ok(body: object): ResponseEntity {
        return { status: HttpStatus.OK, body } as ResponseEntity;
    }

    static created(body: object): ResponseEntity {
        return { status: HttpStatus.CREATED, body }
    }

    static noContent(): ResponseEntity {
        return { status: HttpStatus.NO_CONTENT, body: null } as ResponseEntity;
    }

    static badRequest(body: object) {
        return { status: HttpStatus.BAD_REQUEST, body } as ResponseEntity;
    }

    static forbidden(body: object) {
        return { status: HttpStatus.FORBIDDEN, body } as ResponseEntity;
    }

    static notFound(body: object) {
        return { status: HttpStatus.NOT_FOUND, body } as ResponseEntity;
    }

    static conflict(body: object) {
        return { status: HttpStatus.CONFLICT, body } as ResponseEntity;
    }

}

import HttpStatus from '@constant/http_status';

export default class ResponseEntity {
  status: HttpStatus;
  body: any;

  static create(status: HttpStatus, body: any): ResponseEntity {
    return { status, body } as ResponseEntity;
  }

  static ok(body: unknown): ResponseEntity {
    return { status: HttpStatus.OK, body } as ResponseEntity;
  }

  static created(body: any): ResponseEntity {
    return { status: HttpStatus.CREATED, body };
  }

  static noContent(): ResponseEntity {
    return { status: HttpStatus.NO_CONTENT, body: null } as ResponseEntity;
  }

  static badRequest(body: any): ResponseEntity {
    return { status: HttpStatus.BAD_REQUEST, body } as ResponseEntity;
  }

  static forbidden(body: any): ResponseEntity {
    return { status: HttpStatus.FORBIDDEN, body } as ResponseEntity;
  }

  static notFound(body: any): ResponseEntity {
    return { status: HttpStatus.NOT_FOUND, body } as ResponseEntity;
  }

  static conflict(body: any): ResponseEntity {
    return { status: HttpStatus.CONFLICT, body } as ResponseEntity;
  }
}

/**
 * 커스텀 예외 클래스
 */

import { HttpException, HttpStatus } from "@nestjs/common";
import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS } from "../constants/exception.constants";

export class CustomException extends HttpException {
  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode: string = ERROR_CODES.INTERNAL_SERVER_ERROR) {
    super(
      {
        statusCode,
        message,
        errorCode,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

// 인증 관련 예외
export class UnauthorizedException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}

export class InvalidTokenException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.INVALID_TOKEN) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_TOKEN);
  }
}

export class ExpiredTokenException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.EXPIRED_TOKEN) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.EXPIRED_TOKEN);
  }
}

// 사용자 관련 예외
export class UserNotFoundException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.USER_NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.USER_ALREADY_EXISTS) {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.USER_ALREADY_EXISTS);
  }
}

export class InvalidCredentialsException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.INVALID_CREDENTIALS) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS);
  }
}

// 회사 관련 예외
export class CompanyNotFoundException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.COMPANY_NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.COMPANY_NOT_FOUND);
  }
}

export class CompanyAlreadyExistsException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.COMPANY_ALREADY_EXISTS) {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.COMPANY_ALREADY_EXISTS);
  }
}

// 계약 관련 예외
export class ContractNotFoundException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.CONTRACT_NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.CONTRACT_NOT_FOUND);
  }
}

export class ContractAlreadyExistsException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.CONTRACT_ALREADY_EXISTS) {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONTRACT_ALREADY_EXISTS);
  }
}

// 문서 관련 예외
export class DocumentNotFoundException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.DOCUMENT_NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.DOCUMENT_NOT_FOUND);
  }
}

export class DocumentAlreadyExistsException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.DOCUMENT_ALREADY_EXISTS) {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.DOCUMENT_ALREADY_EXISTS);
  }
}

/**
 * 애플리케이션 공통 에러 타입 정의
 */

export enum ErrorCode {
  // 시스템 에러 (1000-1999)
  INTERNAL_SERVER_ERROR = 1000,
  SERVICE_UNAVAILABLE = 1001,
  DATABASE_ERROR = 1002,
  REDIS_ERROR = 1003,
  MQTT_ERROR = 1004,
  WEBSOCKET_ERROR = 1005,

  // 비즈니스 로직 에러 (2000-2999)
  DRONE_NOT_FOUND = 2000,
  DRONE_NOT_ARMED = 2001,
  INVALID_COMMAND = 2002,
  INVALID_PARAMETER = 2003,
  OPERATION_TIMEOUT = 2004,
  INVALID_MAVLINK_MESSAGE = 2005,

  // 인증/인가 에러 (3000-3999)
  UNAUTHORIZED = 3000,
  FORBIDDEN = 3001,
  INVALID_TOKEN = 3002,
  TOKEN_EXPIRED = 3003,
}

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: any;
  timestamp: string;
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }

  toResponse(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
} 
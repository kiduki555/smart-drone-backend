/**
 * HTTP 예외 필터
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // 로깅
    this.logger.error(
      `${request.method} ${request.url}`,
      {
        statusCode: status,
        error: errorResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      exception.stack
    );

    // 응답 형식 통일
    const responseBody = {
      statusCode: status,
      message:
        typeof errorResponse === "string"
          ? errorResponse
          : (errorResponse as any).message || "알 수 없는 오류가 발생했습니다",
      error:
        typeof errorResponse === "string"
          ? HttpStatus[status]
          : (errorResponse as any).error || HttpStatus[status],
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }
}

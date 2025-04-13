import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError, ErrorCode, ErrorResponse } from '../errors/error.types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let errorResponse: ErrorResponse;

    if (exception instanceof AppError) {
      status = this.getHttpStatus(exception.code);
      errorResponse = exception.toResponse();
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorResponse = {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: typeof exceptionResponse === 'string' 
          ? exceptionResponse 
          : (exceptionResponse as any).message || 'Internal server error',
        timestamp: new Date().toISOString(),
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      };
    }

    response.status(status).json(errorResponse);
  }

  private getHttpStatus(errorCode: number): number {
    if (errorCode >= 3000) return HttpStatus.UNAUTHORIZED;
    if (errorCode >= 2000) return HttpStatus.BAD_REQUEST;
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
} 
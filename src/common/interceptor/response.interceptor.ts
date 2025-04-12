/**
 * 응답 인터셉터
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LoggerService } from "../logger/logger.service";

export interface Response<T> {
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      map((data) => {
        // 로깅
        this.logger.log(`${method} ${url}`, {
          statusCode: 200,
          data,
          timestamp: new Date().toISOString(),
        });

        // 응답 형식 통일
        return {
          data,
          message: "성공적으로 처리되었습니다",
          timestamp: new Date().toISOString(),
        };
      })
    );
  }
}

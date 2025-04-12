// 외부 라이브러리
import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

/**
 * API 응답 데코레이터를 생성합니다
 * @param summary API 요약
 * @param description API 설명
 * @param responseType 응답 타입
 * @param statusCode HTTP 상태 코드
 * @returns 데코레이터
 */
export function ApiResponseDecorator(
  summary: string,
  description: string,
  responseType: any,
  statusCode: number = 200
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: statusCode,
      description,
      type: responseType,
    })
  );
}

/**
 * API 에러 응답 데코레이터를 생성합니다
 * @param summary API 요약
 * @param description API 설명
 * @param statusCode HTTP 상태 코드
 * @returns 데코레이터
 */
export function ApiErrorResponseDecorator(
  summary: string,
  description: string,
  statusCode: number = 400
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: statusCode,
      description,
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: statusCode },
          message: { type: "string", example: description },
          error: { type: "string", example: "Bad Request" },
        },
      },
    })
  );
}

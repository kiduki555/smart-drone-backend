/**
 * Swagger 관련 상수 정의
 */

/**
 * API 태그 상수
 */
export const API_TAGS = {
  AUTH: "인증",
  USER: "유저",
  COMPANY: "회사",
  PROJECT: "프로젝트",
  TASK: "작업",
  NOTIFICATION: "알림",
  SETTING: "설정",
  MAVLINK: "MAVLink 통신",
} as const;

/**
 * API 응답 메시지 상수
 */
export const API_RESPONSE_MESSAGES = {
  SUCCESS: "성공적으로 처리되었습니다.",
  BAD_REQUEST: "잘못된 요청입니다.",
  UNAUTHORIZED: "인증되지 않은 요청입니다.",
  FORBIDDEN: "권한이 없습니다.",
  NOT_FOUND: "리소스를 찾을 수 없습니다.",
  INTERNAL_SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
} as const;

/**
 * API 에러 코드 상수
 */
export const API_ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

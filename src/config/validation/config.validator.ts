/**
 * 설정 검증 모듈입니다.
 *
 * 역할/기능:
 * - 애플리케이션 설정의 유효성을 검증합니다.
 * - Zod를 사용하여 설정 스키마를 정의하고 검증합니다.
 * - 검증 실패 시 상세한 오류 메시지를 제공합니다.
 *
 * @module ConfigValidator
 */

import { z } from "zod";

/**
 * 데이터베이스 설정 스키마입니다.
 */
export const databaseSchema = z.object({
  host: z.string().min(1, "데이터베이스 호스트는 필수입니다."),
  port: z.number().int().positive("데이터베이스 포트는 양수여야 합니다."),
  username: z.string().min(1, "데이터베이스 사용자 이름은 필수입니다."),
  password: z.string().min(1, "데이터베이스 비밀번호는 필수입니다."),
  database: z.string().min(1, "데이터베이스 이름은 필수입니다."),
  synchronize: z.boolean().default(false),
  logging: z.boolean().default(false),
});

/**
 * 서버 설정 스키마입니다.
 */
export const serverSchema = z.object({
  port: z.number().int().positive("서버 포트는 양수여야 합니다."),
  host: z.string().min(1, "서버 호스트는 필수입니다."),
  cors: z.object({
    origin: z.string().array().default(["*"]),
    methods: z.string().array().default(["GET", "POST", "PUT", "DELETE"]),
    credentials: z.boolean().default(true),
  }),
});

/**
 * JWT 설정 스키마입니다.
 */
export const jwtSchema = z.object({
  secret: z.string().min(32, "JWT 시크릿은 최소 32자 이상이어야 합니다."),
  expiresIn: z.string().default("1d"),
  refreshExpiresIn: z.string().default("7d"),
});

/**
 * 로깅 설정 스키마입니다.
 */
export const loggingSchema = z.object({
  level: z.enum(["error", "warn", "info", "debug"]).default("info"),
  format: z.enum(["json", "text"]).default("json"),
  file: z.object({
    enabled: z.boolean().default(false),
    path: z.string().optional(),
    maxSize: z.string().optional(),
    maxFiles: z.number().optional(),
  }),
});

/**
 * 전체 설정 스키마입니다.
 */
export const configSchema = z.object({
  environment: z.enum(["development", "test", "staging", "production"]),
  database: databaseSchema,
  server: serverSchema,
  jwt: jwtSchema,
  logging: loggingSchema,
});

/**
 * 설정을 검증합니다.
 *
 * @param config - 검증할 설정 객체
 * @returns {z.infer<typeof configSchema>} 검증된 설정 객체
 * @throws {z.ZodError} 설정이 유효하지 않은 경우
 */
export function validateConfig(config: unknown): z.infer<typeof configSchema> {
  return configSchema.parse(config);
}

/**
 * 설정 검증 오류를 포맷팅합니다.
 *
 * @param error - Zod 오류 객체
 * @returns {string} 포맷팅된 오류 메시지
 */
export function formatValidationError(error: z.ZodError): string {
  return error.errors
    .map((err) => {
      const path = err.path.join(".");
      return `${path}: ${err.message}`;
    })
    .join("\n");
}

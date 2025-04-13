/**
 * 환경 설정을 관리하는 모듈입니다.
 *
 * 역할/기능:
 * - 애플리케이션의 환경별 설정값을 관리합니다.
 * - 개발, 테스트, 스테이징, 프로덕션 환경에 따른 설정을 제공합니다.
 * - 환경 변수를 통한 설정 오버라이드를 지원합니다.
 * - 설정값의 유효성을 검증합니다.
 *
 * @module EnvironmentConfig
 */

import path from "path";
import { config } from "dotenv";
import dotenv from "dotenv";
import fs from "fs/promises";
import { z } from "zod";
import { configSchema, validateConfig } from "../validation/config.validator";

// 환경 변수 로드
config();

/**
 * 환경 타입을 정의하는 enum입니다.
 */
export enum Environment {
  Development = "development",
  Test = "test",
  Staging = "staging",
  Production = "production",
}

/**
 * 환경 설정 스키마를 정의합니다.
 */
const EnvironmentSchema = z.object({
  // 서버 설정
  NODE_ENV: z.nativeEnum(Environment),
  PORT: z.string().transform(Number),
  HOST: z.string().default("localhost"),

  // 데이터베이스 설정
  DATABASE_URL: z.string(),
  DATABASE_POOL_MIN: z.string().transform(Number).default("2"),
  DATABASE_POOL_MAX: z.string().transform(Number).default("10"),

  // JWT 설정
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("1d"),

  // 로깅 설정
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_FORMAT: z.enum(["json", "text"]).default("json"),

  // API 설정
  API_PREFIX: z.string().default("/api"),
  API_VERSION: z.string().default("v1"),

  // 보안 설정
  CORS_ORIGIN: z.string().default("*"),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("60000"),
  RATE_LIMIT_MAX: z.string().transform(Number).default("100"),
});

/**
 * 환경 설정 타입을 정의합니다.
 */
export type EnvironmentConfig = z.infer<typeof EnvironmentSchema>;

/**
 * 앱 설정 타입을 정의합니다.
 */
export type AppConfig = z.infer<typeof configSchema>;

/**
 * 환경 설정을 로드하는 모듈입니다.
 *
 * @returns {Promise<AppConfig>} 로드된 설정
 * @throws {Error} 설정 로드 실패 시
 */
export async function loadEnvironmentConfig(): Promise<AppConfig> {
  try {
    // 1. .env 파일 로드
    dotenv.config();

    // 2. 환경별 설정 파일 경로 결정
    const env = process.env.NODE_ENV || "development";
    const configPath = path.join(process.cwd(), "config", `${env}.json`);

    // 3. 설정 파일 로드
    let fileConfig = {};
    try {
      const configData = await fs.readFile(configPath, "utf-8");
      fileConfig = JSON.parse(configData);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw new Error(`설정 파일 로드 실패: ${error.message}`);
      }
    }

    // 4. 환경 변수와 설정 파일 병합
    const envConfig = {
      database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432", 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      },
      logging: {
        level: process.env.LOG_LEVEL || "info",
        format: process.env.LOG_FORMAT || "json",
      },
      api: {
        port: parseInt(process.env.API_PORT || "3000", 10),
        prefix: process.env.API_PREFIX || "/api",
      },
      security: {
        corsOrigin: process.env.CORS_ORIGIN?.split(",") || ["*"],
        rateLimit: {
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
          max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
        },
      },
    };

    // 5. 설정 병합 (환경 변수가 우선)
    const mergedConfig = {
      ...fileConfig,
      ...envConfig,
    };

    return validateConfig(mergedConfig);
  } catch (error) {
    throw new Error(`환경 설정 로드 실패: ${error.message}`);
  }
}

/**
 * 현재 실행 환경을 반환합니다.
 *
 * @returns {Environment} 현재 실행 환경
 */
export function getCurrentEnvironment(): Environment {
  const env = process.env.NODE_ENV?.toLowerCase();

  if (!env) {
    return Environment.Development;
  }

  switch (env) {
    case "development":
      return Environment.Development;
    case "test":
      return Environment.Test;
    case "staging":
      return Environment.Staging;
    case "production":
      return Environment.Production;
    default:
      return Environment.Development;
  }
}

/**
 * 환경이 개발 환경인지 확인합니다.
 *
 * @returns {boolean} 개발 환경 여부
 */
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === Environment.Development;
}

/**
 * 환경이 테스트 환경인지 확인합니다.
 *
 * @returns {boolean} 테스트 환경 여부
 */
export function isTest(): boolean {
  return getCurrentEnvironment() === Environment.Test;
}

/**
 * 환경이 스테이징 환경인지 확인합니다.
 *
 * @returns {boolean} 스테이징 환경 여부
 */
export function isStaging(): boolean {
  return getCurrentEnvironment() === Environment.Staging;
}

/**
 * 환경이 프로덕션 환경인지 확인합니다.
 *
 * @returns {boolean} 프로덕션 환경 여부
 */
export function isProduction(): boolean {
  return getCurrentEnvironment() === Environment.Production;
}

/**
 * 필수 환경 변수를 검증합니다.
 *
 * @param requiredVars - 필수 환경 변수 목록
 * @throws {Error} 필수 환경 변수가 누락된 경우
 */
export function validateRequiredEnvVars(requiredVars: string[]): void {
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`필수 환경 변수가 누락되었습니다: ${missingVars.join(", ")}`);
  }
}

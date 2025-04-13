/**
 * Pino를 사용한 로거 서비스
 */

import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import pino from "pino";

/**
 * 확장된 로깅 서비스
 * 다양한 로깅 레벨과 컨텍스트 정보를 제공
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: pino.Logger;
  private readonly isDevelopment: boolean;

  constructor(private readonly configService: ConfigService) {
    const isProduction = this.configService.get("NODE_ENV") === "production";

    this.logger = pino({
      level: isProduction ? "info" : "debug",
      transport: isProduction
        ? undefined
        : {
            target: "pino-pretty",
            options: {
              colorize: true,
              levelFirst: true,
              translateTime: "yyyy-mm-dd HH:MM:ss",
            },
          },
      formatters: {
        level: (label) => {
          return { level: label };
        },
      },
      timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    });

    this.isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
  }

  /**
   * 시스템 시작, 종료 등 중요 이벤트 로깅
   */
  log(message: any, context?: string) {
    this.logger.info(this.formatMessage(message, 'INFO', context));
  }

  /**
   * 디버깅용 상세 정보 로깅
   */
  debug(message: any, context?: string) {
    if (this.isDevelopment) {
      this.logger.debug(this.formatMessage(message, 'DEBUG', context));
    }
  }

  /**
   * 경고 메시지 로깅
   */
  warn(message: any, context?: string) {
    this.logger.warn(this.formatMessage(message, 'WARN', context));
  }

  /**
   * 에러 메시지 로깅
   */
  error(message: any, trace?: string, context?: string) {
    this.logger.error(
      this.formatMessage(message, 'ERROR', context),
      trace,
      context
    );
  }

  /**
   * 매우 상세한 추적 정보 로깅 (개발 환경에서만)
   */
  trace(message: any, context?: string) {
    if (this.isDevelopment) {
      this.logger.trace(this.formatMessage(message, 'TRACE', context));
    }
  }

  /**
   * 메시지 포맷팅
   */
  private formatMessage(message: any, level: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    return `[${timestamp}] ${level} ${contextStr} ${message}`;
  }

  /**
   * 비즈니스 로직 성공 로깅
   */
  success(message: string, context?: string) {
    this.logger.info(this.formatMessage(`✅ ${message}`, 'SUCCESS', context));
  }

  /**
   * API 요청/응답 로깅
   */
  api(message: string, method: string, path: string, statusCode?: number) {
    const status = statusCode ? `[${statusCode}]` : '';
    this.logger.info(
      this.formatMessage(`🌐 ${method} ${path} ${status} - ${message}`, 'API')
    );
  }

  /**
   * 데이터베이스 작업 로깅
   */
  database(message: string, operation: string) {
    this.logger.debug(
      this.formatMessage(`🗄️ ${operation} - ${message}`, 'DATABASE')
    );
  }

  /**
   * 외부 서비스 통신 로깅
   */
  external(message: string, service: string) {
    this.logger.debug(
      this.formatMessage(`🔌 ${service} - ${message}`, 'EXTERNAL')
    );
  }
}

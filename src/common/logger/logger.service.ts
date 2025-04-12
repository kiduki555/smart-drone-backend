/**
 * Pino를 사용한 로거 서비스
 */

import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";
import pino from "pino";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: pino.Logger;

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
  }

  /**
   * 로그 레벨: debug
   */
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  /**
   * 로그 레벨: error
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  /**
   * 로그 레벨: log
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  /**
   * 로그 레벨: verbose
   */
  verbose(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, ...optionalParams);
  }

  /**
   * 로그 레벨: warn
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }
}

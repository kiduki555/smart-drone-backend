import { Global, Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";

/**
 * 전역 로거 모듈
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

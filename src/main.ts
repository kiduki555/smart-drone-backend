import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filter/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptor/response.interceptor";
import { LoggerService } from "./common/logger/logger.service";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // 전역 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // 전역 필터
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // 전역 인터셉터
  app.useGlobalInterceptors(new ResponseInterceptor(logger));

  // CORS 설정
  app.enableCors();

  // 글로벌 접두사 설정
  app.setGlobalPrefix("api");

  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

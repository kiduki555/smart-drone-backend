import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class IsDevelopmentGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const isDevelopment = this.configService.get<string>("NODE_ENV") === "development";
    if (!isDevelopment) {
      throw new Error("This endpoint is only available in development environment");
    }
    return true;
  }
}

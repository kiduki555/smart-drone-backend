/**
 * 역할 기반 접근 제어 가드
 * 사용자의 역할을 기반으로 리소스 접근을 제어합니다.
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCode } from '../errors/error.types';
import { AppError } from '../errors/error.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'User role not found'
      );
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        'Insufficient permissions'
      );
    }

    return true;
  }
} 
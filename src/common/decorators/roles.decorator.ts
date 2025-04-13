/**
 * 역할 기반 접근 제어를 위한 데코레이터
 * 컨트롤러나 핸들러에 필요한 역할을 지정합니다.
 */
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); 
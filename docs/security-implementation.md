# 보안 구현 상세

## 인증 시스템

### JWT 인증
```typescript
// JWT 토큰 생성
const token = await this.jwtService.signAsync(payload, {
  secret: configService.get<string>('JWT_SECRET'),
  expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
});

// JWT 토큰 검증
const payload = await this.jwtService.verifyAsync(token);
```

### 세션 관리
```typescript
// 세션 생성
const sessionId = uuidv4();
await this.redisService.set(
  `session:${sessionId}`,
  JSON.stringify(sessionData),
  'EX',
  SESSION_TTL
);

// 세션 검증
const sessionData = await this.redisService.get(`session:${sessionId}`);
```

## 역할 기반 접근 제어 (RBAC)

### 역할 정의
```typescript
export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}
```

### 가드 구현
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### 데코레이터 사용
```typescript
@Controller('drones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DroneController {
  @Post('arm')
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async armDrone() {
    // 드론 시동 로직
  }
}
```

## 데이터 보안

### 비밀번호 해싱
```typescript
// 비밀번호 해싱
const hashedPassword = await bcrypt.hash(password, saltRounds);

// 비밀번호 검증
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### 데이터 암호화
```typescript
// 데이터 암호화
const encryptedData = await this.cryptoService.encrypt(sensitiveData);

// 데이터 복호화
const decryptedData = await this.cryptoService.decrypt(encryptedData);
```

## 보안 모니터링

### 로깅
```typescript
// 보안 이벤트 로깅
this.logger.security('User login attempt', {
  userId,
  ipAddress,
  userAgent,
  success: false,
  reason: 'Invalid credentials',
});
```

### 감사 추적
```typescript
// 감사 로그 기록
await this.auditService.log({
  action: 'DRONE_ARM',
  userId,
  resourceId: droneId,
  status: 'SUCCESS',
  metadata: {
    timestamp: new Date(),
    location: '127.0.0.1',
  },
});
```

## 보안 설정

### 환경 변수
```env
# JWT 설정
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# 암호화 설정
ENCRYPTION_KEY=your-encryption-key
ENCRYPTION_IV=your-iv

# 세션 설정
SESSION_TTL=3600
```

### 보안 헤더
```typescript
// 보안 헤더 설정
app.use(helmet());
app.use(cors({
  origin: configService.get<string>('ALLOWED_ORIGINS').split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## 보안 모범 사례

### 1. 입력 검증
- 모든 사용자 입력 검증
- SQL 인젝션 방지
- XSS 방지

### 2. 에러 처리
- 상세한 에러 메시지 노출 금지
- 적절한 HTTP 상태 코드 사용
- 보안 로깅

### 3. 세션 관리
- 안전한 세션 ID 생성
- 적절한 세션 타임아웃
- 세션 고정 방지

### 4. 암호화
- 강력한 암호화 알고리즘 사용
- 안전한 키 관리
- 정기적인 키 순환

### 5. 모니터링
- 실시간 보안 이벤트 모니터링
- 정기적인 보안 감사
- 침입 탐지 시스템 
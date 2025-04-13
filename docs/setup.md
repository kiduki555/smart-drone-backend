# 개발 환경 설정 가이드

## 필수 요구사항

### 시스템 요구사항
- Node.js v16 이상
- npm v8 이상
- MongoDB v4.4 이상
- Redis v6 이상
- MQTT Broker (Mosquitto 권장)

### 개발 도구
- VS Code (권장)
- Git
- Docker (선택사항)
- Postman (API 테스트용)

## 초기 설정

### 1. 저장소 클론
```bash
git clone https://github.com/your-org/smart-gcs-backend.git
cd smart-gcs-backend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일 생성:
```env
# 애플리케이션 설정
NODE_ENV=development
PORT=3000

# 데이터베이스 설정
MONGODB_URI=mongodb://localhost:27017/smart-gcs
REDIS_HOST=localhost
REDIS_PORT=6379

# MQTT 설정
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password

# JWT 설정
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# 보안 설정
CORS_ORIGIN=http://localhost:3000
```

### 4. 데이터베이스 설정
```bash
# MongoDB 시작
mongod --dbpath /path/to/data/db

# Redis 시작
redis-server
```

### 5. MQTT Broker 설정
```bash
# Mosquitto 설치 (Ubuntu)
sudo apt-get install mosquitto mosquitto-clients

# Mosquitto 시작
mosquitto -c /etc/mosquitto/mosquitto.conf
```

## 개발 워크플로우

### 1. 개발 서버 실행
```bash
# 개발 모드
npm run start:dev

# 디버그 모드
npm run start:debug

# 프로덕션 모드
npm run start:prod
```

### 2. 테스트 실행
```bash
# 단위 테스트
npm run test

# e2e 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

### 3. 코드 품질 검사
```bash
# 린트
npm run lint

# 포맷팅
npm run format

# 타입 체크
npm run type-check
```

## Docker 개발 환경

### 1. Docker Compose 설정
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - mongodb
      - redis
      - mqtt

  mongodb:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:6
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  mqtt:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf

volumes:
  mongodb_data:
  redis_data:
```

### 2. Docker 개발 환경 실행
```bash
# 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

## 문제 해결

### 1. 일반적인 문제
- 포트 충돌: 다른 포트 사용 또는 실행 중인 프로세스 종료
- 의존성 문제: `node_modules` 삭제 후 재설치
- 환경 변수 문제: `.env` 파일 확인 및 수정

### 2. 데이터베이스 연결 문제
```bash
# MongoDB 연결 확인
mongosh "mongodb://localhost:27017/smart-gcs"

# Redis 연결 확인
redis-cli ping
```

### 3. MQTT 연결 문제
```bash
# MQTT 브로커 상태 확인
systemctl status mosquitto

# MQTT 클라이언트로 테스트
mosquitto_sub -t "#" -v
```

## 추가 리소스

### 문서
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [MongoDB 문서](https://docs.mongodb.com/)
- [Redis 문서](https://redis.io/documentation)
- [MQTT 문서](https://mqtt.org/documentation)

### 커뮤니티
- [NestJS Discord](https://discord.gg/nestjs)
- [GitHub Issues](https://github.com/your-org/smart-gcs-backend/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nestjs) 
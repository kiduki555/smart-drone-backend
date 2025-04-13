# API 명세서

## 개요
이 문서는 Smart GCS Backend의 API 명세를 정의합니다.

## 기본 정보
- Base URL: `/api/v1`
- 인증: JWT Bearer Token
- 응답 형식: JSON

## 공통 응답 형식
```json
{
  "success": boolean,
  "data": any,
  "error": {
    "code": number,
    "message": string,
    "details": any
  }
}
```

## 에러 코드
| 코드 | 설명 |
|------|------|
| 1000 | 내부 서버 에러 |
| 1001 | 서비스 불가 |
| 1002 | 데이터베이스 에러 |
| 1003 | Redis 에러 |
| 1004 | MQTT 에러 |
| 2000 | 드론 미발견 |
| 2001 | 드론 미준비 |
| 2002 | 잘못된 명령 |
| 2003 | 잘못된 파라미터 |
| 2004 | 작업 타임아웃 |
| 2005 | 잘못된 MAVLink 메시지 |
| 3000 | 미인증 |
| 3001 | 접근 거부 |
| 3002 | 잘못된 토큰 |
| 3003 | 토큰 만료 |

## 엔드포인트

### 인증
- `POST /auth/login`: 사용자 로그인
- `POST /auth/refresh`: 토큰 갱신
- `POST /auth/logout`: 로그아웃

### 드론 관리
- `GET /drones`: 연결된 드론 목록 조회
- `GET /drones/:id`: 특정 드론 정보 조회
- `POST /drones/:id/arm`: 드론 시동
- `POST /drones/:id/disarm`: 드론 시동 해제
- `POST /drones/:id/takeoff`: 이륙
- `POST /drones/:id/land`: 착륙
- `POST /drones/:id/set-mode`: 비행 모드 변경

### MAVLink 통신
- `GET /mavlink/messages`: MAVLink 메시지 조회
- `POST /mavlink/send`: MAVLink 메시지 전송
- `WS /mavlink/stream`: MAVLink 메시지 실시간 스트림

### 시스템 관리
- `GET /system/health`: 시스템 상태 확인
- `GET /system/metrics`: 시스템 메트릭 조회
- `GET /system/resources`: 시스템 리소스 사용량 조회 
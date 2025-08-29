import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs('base-database', () => ({
  type: 'mysql' as const,
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: {
    // 커넥션 풀 설정
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10, // 최대 연결 수 (기본 10개)
    acquireTimeout: Number(process.env.DB_ACQUIRE_TIMEOUT) || 60000, // 연결 획득 타임아웃 (60초)
    timeout: Number(process.env.DB_TIMEOUT) || 60000, // 쿼리 실행 타임아웃 (60초)
    reconnect: true, // 연결 끊김 시 자동 재연결
    
    // 성능 최적화 설정
    supportBigNumbers: true, // 큰 숫자 지원 (BIGINT 등)
    bigNumberStrings: false, // 큰 숫자를 문자열로 반환하지 않음
    dateStrings: false, // 날짜를 문자열로 반환하지 않음
    
    // SSL 설정 (운영환경에서만)
    ssl: process.env.NODE_ENV === 'production' ? { 
      rejectUnauthorized: false // SSL 인증서 검증 비활성화 (운영환경)
    } : false,
    
    // 기타 설정
    multipleStatements: false, // 다중 쿼리 실행 비활성화 (보안)
    debug: false, // 디버그 모드 비활성화
    trace: false, // 트레이스 모드 비활성화
  },
  maxQueryExecutionTime: 1000,
  logging: [],
  bigNumberStrings: false,
  namingStrategy: new SnakeNamingStrategy(),
}));

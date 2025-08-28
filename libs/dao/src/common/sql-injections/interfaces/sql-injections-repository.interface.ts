import { SqlInjection } from './sql-injection.interface';

export interface SqlInjectionsRepository {
  /**
   * SQL 인젝션 테스트를 위한 안전한 쿼리 실행
   * TypeORM Query Builder를 사용하여 파라미터화된 쿼리로 실행
   */
  findByContentsSafe(contents: string): Promise<SqlInjection | null>;

  /**
   * 여러 조건으로 SQL 인젝션 데이터 검색
   */
  findByMultipleConditions(
    contents?: string,
    limit?: number,
    offset?: number
  ): Promise<SqlInjection[]>;

  /**
   * SQL 인젝션 테스트 데이터 생성
   */
  createTestData(contents: string): Promise<SqlInjection>;

  /**
   * SQL 인젝션 패턴 분석을 위한 전체 데이터 조회
   */
  findAllForAnalysis(): Promise<SqlInjection[]>;

  /**
   * 특정 패턴을 포함하는 데이터 검색 (LIKE 쿼리)
   */
  findByPattern(pattern: string): Promise<SqlInjection[]>;

  /**
   * 복합 조건 검색 (AND/OR 조건)
   */
  findByComplexConditions(
    conditions: {
      contents?: string;
      includePattern?: string;
      excludePattern?: string;
      createdAfter?: Date;
      createdBefore?: Date;
    }
  ): Promise<SqlInjection[]>;

  /**
   * 페이징을 지원하는 검색
   */
  findWithPagination(
    page: number,
    pageSize: number,
    searchPattern?: string
  ): Promise<{
    data: SqlInjection[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;

  /**
   * 통계 정보 조회
   */
  getStatistics(): Promise<{
    totalCount: number;
    uniqueContentsCount: number;
    recentCount: number;
  }>;
}

export const SqlInjectionsRepository = Symbol('SqlInjectionsRepository');
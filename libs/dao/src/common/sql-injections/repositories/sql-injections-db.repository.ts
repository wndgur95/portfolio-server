import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { SqlInjectionEntity } from '../entities/sql-injection.entity';
import { SqlInjectionsRepository } from '../interfaces/sql-injections-repository.interface';
import { SqlInjection } from '../interfaces/sql-injection.interface';

@EntityRepository(SqlInjectionEntity)
export class SqlInjectionsDbRepository
  extends AbstractRepository<SqlInjectionEntity>
  implements SqlInjectionsRepository
{
  /**
   * SQL 인젝션 테스트를 위한 안전한 쿼리 실행
   * TypeORM Query Builder를 사용하여 파라미터화된 쿼리로 실행
   */
  async findByContentsSafe(contents: string): Promise<SqlInjection | null> {
    return await this.queryBuilder
      .where(`${this.alias}.contents = :contents`, { contents })
      .getOne();
  }

  /**
   * 여러 조건으로 SQL 인젝션 데이터 검색
   */
  async findByMultipleConditions(
    contents?: string,
    limit = 10,
    offset = 0
  ): Promise<SqlInjection[]> {
    const queryBuilder = this.queryBuilder;

    if (contents) {
      queryBuilder.where(`${this.alias}.contents = :contents`, { contents });
    }

    return await queryBuilder
      .orderBy(`${this.alias}.created_at`, 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  /**
   * SQL 인젝션 테스트 데이터 생성
   */
  async createTestData(contents: string): Promise<SqlInjection> {
    const entity = this.create({
      contents,
    });

    return await this.save(entity);
  }

  /**
   * SQL 인젝션 패턴 분석을 위한 전체 데이터 조회
   */
  async findAllForAnalysis(): Promise<SqlInjection[]> {
    return await this.queryBuilder
      .orderBy(`${this.alias}.created_at`, 'DESC')
      .getMany();
  }

  /**
   * 특정 패턴을 포함하는 데이터 검색 (LIKE 쿼리)
   */
  async findByPattern(pattern: string): Promise<SqlInjection[]> {
    return await this.queryBuilder
      .where(`${this.alias}.contents LIKE :pattern`, { 
        pattern: `%${pattern}%` 
      })
      .orderBy(`${this.alias}.created_at`, 'DESC')
      .getMany();
  }

  /**
   * 복합 조건 검색 (AND/OR 조건)
   */
  async findByComplexConditions(conditions: {
    contents?: string;
    includePattern?: string;
    excludePattern?: string;
    createdAfter?: Date;
    createdBefore?: Date;
  }): Promise<SqlInjection[]> {
    const queryBuilder = this.queryBuilder;

    if (conditions.contents) {
      queryBuilder.where(`${this.alias}.contents = :contents`, { 
        contents: conditions.contents 
      });
    }

    if (conditions.includePattern) {
      queryBuilder.andWhere(`${this.alias}.contents LIKE :includePattern`, { 
        includePattern: `%${conditions.includePattern}%` 
      });
    }

    if (conditions.excludePattern) {
      queryBuilder.andWhere(`${this.alias}.contents NOT LIKE :excludePattern`, { 
        excludePattern: `%${conditions.excludePattern}%` 
      });
    }

    if (conditions.createdAfter) {
      queryBuilder.andWhere(`${this.alias}.created_at >= :createdAfter`, { 
        createdAfter: conditions.createdAfter 
      });
    }

    if (conditions.createdBefore) {
      queryBuilder.andWhere(`${this.alias}.created_at <= :createdBefore`, { 
        createdBefore: conditions.createdBefore 
      });
    }

    return await queryBuilder
      .orderBy(`${this.alias}.created_at`, 'DESC')
      .getMany();
  }

  /**
   * 페이징을 지원하는 검색
   */
  async findWithPagination(
    page: number,
    pageSize: number,
    searchPattern?: string
  ): Promise<{
    data: SqlInjection[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const queryBuilder = this.queryBuilder;

    if (searchPattern) {
      queryBuilder.where(`${this.alias}.contents LIKE :searchPattern`, { 
        searchPattern: `%${searchPattern}%` 
      });
    }

    const [data, total] = await queryBuilder
      .orderBy(`${this.alias}.created_at`, 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * 통계 정보 조회
   */
  async getStatistics(): Promise<{
    totalCount: number;
    uniqueContentsCount: number;
    recentCount: number;
  }> {
    // 전체 개수
    const totalCount = await this.queryBuilder.getCount();

    // 고유한 contents 개수
    const uniqueContentsResult = await this.queryBuilder
      .select(`COUNT(DISTINCT ${this.alias}.contents)`, 'count')
      .getRawOne();
    
    const uniqueContentsCount = parseInt(uniqueContentsResult?.count || '0');

    // 최근 24시간 내 데이터 개수
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const recentCount = await this.queryBuilder
      .where(`${this.alias}.created_at >= :twentyFourHoursAgo`, { 
        twentyFourHoursAgo 
      })
      .getCount();

    return {
      totalCount,
      uniqueContentsCount,
      recentCount,
    };
  }
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationOutDto } from '@libs/common/dto/pagination-out.dto';

class BodyBuilder {
  private readonly _code: number;
  private _body: any | any[];
  private _pagination?: PaginationOutDto;

  constructor(code: number) {
    this._code = code;
  }

  body<T>(body: T): ResponseEntity<T>;
  body<T>(body: T[]): ResponseEntity<T[]>;
  body<T>(body: T | T[]): ResponseEntity<T | T[]> {
    this._body = body;
    return new ResponseEntity<T>(
      this._code,
      this._body,
      undefined,
      undefined,
      this._pagination,
    );
  }

  pagination(pagination: PaginationOutDto): this {
    this._pagination = pagination;
    return this;
  }

  build<T>(): ResponseEntity<T> {
    return new ResponseEntity(
      this._code,
      this._body,
      undefined,
      undefined,
      this._pagination,
    );
  }
}

export class ResponseEntity<T> {
  @ApiProperty() private code: number;
  @ApiPropertyOptional() private data?: T | T[];
  @ApiPropertyOptional() private payLoad?: object;
  @ApiPropertyOptional() private message?: string;
  @ApiPropertyOptional() private pagination?: PaginationOutDto;

  constructor(
    code: number,
    body?: T | T[],
    message?: string,
    payLoad?: object,
    pagination?: PaginationOutDto,
  ) {
    this.code = code;
    this.data = body;
    this.message = message;
    this.payLoad = payLoad;
    this.pagination = pagination;
  }

  static ok(): BodyBuilder;
  static ok<T>(body: T): ResponseEntity<T>;
  static ok<T>(body: T[]): ResponseEntity<T[]>;
  static ok<T>(body?: T | T[]): ResponseEntity<T | T[]> | BodyBuilder {
    return body ? new ResponseEntity(0, body) : new BodyBuilder(0);
  }

  static error<T>(code = 99999, message?: string): ResponseEntity<T> {
    return new ResponseEntity<T>(code, undefined, message);
  }
}

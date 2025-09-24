import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';

export class MongoLog {
  @ApiProperty()
  @IsString()
  collectionName: string;

  @ApiProperty()
  contents: any[];
}

export class MongoLogs {
  @ApiProperty()
  nid: string;

  @ApiProperty()
  gameDbId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  logs: Record<string, any[]>;

  constructor(partial?: Partial<MongoLogs>) {
    Object.assign(this, partial);
  }
}

export class MongoLogImportDto extends BaseMongoLogCollection {
  @ApiProperty()
  logs: Record<string, any[]>;

  constructor(partial?: Partial<MongoLogImportDto>) {
    super();
    Object.assign(this, partial);
  }
}

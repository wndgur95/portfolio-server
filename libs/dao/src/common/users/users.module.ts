import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [UsersDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: UsersRepository,
      inject: [UsersDbRepository],
      useFactory: (repo: UsersDbRepository): UsersRepository => repo,
    },
  ],
  exports: [UsersRepository],
})
export class UsersModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}

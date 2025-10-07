import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { USER_ROLES, UserRoles } from '@libs/common/constants/role.constants';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Entity('user')
@BaseTimeEntity()
@Index(['email', 'platformId'], { unique: true })
export class UserEntity extends AbstractEntity implements User {
  @Index({ unique: true })
  @Column()
  nid: string;

  @Index()
  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Index()
  @Column({ nullable: true })
  platformId?: string;

  @Index()
  @Column({ nullable: true })
  address?: string;

  @Column({
    default: USER_ROLES.GUEST,
  })
  roles: UserRoles;

  @Column({ default: 0 })
  gameDbId: number;

  @Index()
  @Column({ nullable: true })
  provider?: string;

  @Column({ length: 512, nullable: true })
  refreshToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      if (this.platformId == null && this.address == null) {
        this.password = await bcrypt.hash(this.password, 10);
      } else if (this.password != null) {
        throw new InternalServerErrorException();
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.USER_MISMATCHED_PASSWORD,
      );
    }
  }
}

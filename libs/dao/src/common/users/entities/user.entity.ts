import { BeforeInsert, Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { USER_ROLES, UserRoles } from '@libs/common/constants/role.constants';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@libs/dao/common/users/interfaces/user.interface';

@Entity('user')
@BaseTimeEntity()
@Index(['email', 'platformId'], { unique: true })
export class UserEntity extends AbstractEntity implements User {
  @Index()
  @Column({ nullable: true })
  email?: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column({ comment: '추천 코드' })
  recommendCode: string;

  @Column({ nullable: true })
  password?: string;

  @Index()
  @Column({ nullable: true })
  platformId?: string;

  @Column({
    default: USER_ROLES.GUEST,
  })
  roles: UserRoles;

  @Column({ type: 'timestamp', nullable: true })
  activatedAt: Date;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 0 })
  userDbId: number;

  @Index()
  @Column({ nullable: true })
  provider?: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      if (this.platformId == null) {
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
      throw new InternalServerErrorException(e);
    }
  }
}

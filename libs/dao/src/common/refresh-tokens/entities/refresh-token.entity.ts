import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column({ name: 'device_info', nullable: true })
  deviceInfo?: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  static create(data: {
    userId: number;
    token: string;
    expiresAt: Date;
    deviceInfo?: string;
    ipAddress?: string;
  }): RefreshTokenEntity {
    const entity = new RefreshTokenEntity();
    entity.userId = data.userId;
    entity.token = data.token;
    entity.expiresAt = data.expiresAt;
    entity.deviceInfo = data.deviceInfo;
    entity.ipAddress = data.ipAddress;
    return entity;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }
} 
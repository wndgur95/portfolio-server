import { Column, Entity } from "typeorm";
import { AbstractEntity, BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { WeddingMessage } from '@libs/dao/wedding/wedding-messages/interfaces/wedding-message.interface';

@Entity('wedding_message')
@BaseTimeEntity()
export class WeddingMessageEntity extends AbstractEntity implements WeddingMessage {
  @Column({ comment: 'name' })
  name: string;

  @Column({ comment: 'name', type: 'text' })
  context: string;
}

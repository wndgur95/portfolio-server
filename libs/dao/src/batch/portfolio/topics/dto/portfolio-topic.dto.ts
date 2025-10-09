import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { TopicDto } from '@libs/dao/batch/abstract/topics/dto/topic.dto';

@EntitySerializeImpl()
export class PortfolioTopicDto extends TopicDto<PortfolioTopicDto> {}

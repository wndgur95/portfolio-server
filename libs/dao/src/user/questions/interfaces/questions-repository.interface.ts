import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { QuestionEntity } from "@libs/dao/user/questions/entities/question.entity";

export interface QuestionsRepository extends AbstractRepositoryInterface<QuestionEntity> {}

export const QuestionsRepository = Symbol('QuestionsRepository');
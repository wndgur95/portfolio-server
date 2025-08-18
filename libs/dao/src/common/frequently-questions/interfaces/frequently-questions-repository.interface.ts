import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { FrequentlyQuestionEntity } from "@libs/dao/common/frequently-questions/entities/frequently-question.entity";

export interface FrequentlyQuestionsRepository extends AbstractRepositoryInterface<FrequentlyQuestionEntity> {}

export const FrequentlyQuestionsRepository = Symbol('FrequentlyQuestionsRepository');
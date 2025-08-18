import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { FrequentlyQuestionsRepository } from '@libs/dao/common/frequently-questions/interfaces/frequently-questions-repository.interface';
import { QuestionsDbRepositories } from '@libs/dao/user/questions/repositories/questions-db.repository';
import { QuestionsRepository } from '@libs/dao/user/questions/interfaces/questions-repository.interface';
import { FrequentlyQuestion } from '@libs/dao/common/frequently-questions/interfaces/frequently-question.interface';
import { Question } from '@libs/dao/user/questions/interfaces/question.interface';
import { CreateQuestionInDto } from './dto/create-question.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { QuestionEntity } from '@libs/dao/user/questions/entities/question.entity';
import { UpdateQuestionInDto } from './dto/update-question.dto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class QuestionService {
  private frequentlyQuestion = null;

  constructor(
    @Inject(FrequentlyQuestionsRepository)
    private readonly frequentlyQuestionsRepository: FrequentlyQuestionsRepository,

    @Inject(QuestionsRepository)
    private readonly questionsDbRepositories: QuestionsDbRepositories,
  ) {}

  async getFrequentlyQuestion(): Promise<FrequentlyQuestion[]> {
    if (!this.frequentlyQuestion) {
      this.frequentlyQuestion = await this.frequentlyQuestionsRepository.find({
        order: {
          id: 'DESC',
        },
      });
    }

    return this.frequentlyQuestion;
  }

  async getQuestion(userId: number): Promise<Question[]> {
    const database = ContextProvider.getUserDatabase();

    return await this.questionsDbRepositories[database].find({
      where: { userId },
      order: {
        id: 'DESC',
      },
    });
  }

  async createQuestion(
    user: User,
    createQuestionInDto: CreateQuestionInDto,
  ): Promise<Question> {
    return await this._saveQuestion(
      QuestionEntity.create({
        userId: user.id,
        question: createQuestionInDto.question,
      }),
    );
  }

  async updateQuestion(
    user: User,
    questionId: number,
    updateQuestionInDto: UpdateQuestionInDto,
  ): Promise<Question> {
    const database = ContextProvider.getUserDatabase();

    const question =
      await this.questionsDbRepositories[database].findById(questionId);

    if (question.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.QUESTION_NOT_MINE);
    }

    question.question = updateQuestionInDto.question;

    return await this._saveQuestion(question);
  }

  async deleteQuestion(user: User, questionId: number): Promise<void> {
    const database = ContextProvider.getUserDatabase();

    const question =
      await this.questionsDbRepositories[database].findById(questionId);

    if (question.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.QUESTION_NOT_MINE);
    }

    await this._deleteQuestion(questionId);
  }

  @Transactional()
  private async _saveQuestion(question: Question): Promise<Question> {
    const database = ContextProvider.getUserDatabase();

    return await this.questionsDbRepositories[database].save(question);
  }

  @Transactional()
  private async _deleteQuestion(questionId: number): Promise<void> {
    const database = ContextProvider.getUserDatabase();

    await this.questionsDbRepositories[database].deleteById(questionId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { QuestionService } from './question.service';
import { FrequentlyQuestion } from '@libs/dao/common/frequently-questions/interfaces/frequently-question.interface';
import { FrequentlyQuestionDto } from '@libs/dao/common/frequently-questions/dto/frequently-question.dto';
import { QuestionDto } from '@libs/dao/user/questions/dto/question.dto';
import { CreateQuestionInDto } from './dto/create-question.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { Question } from '@libs/dao/user/questions/interfaces/question.interface';
import { UpdateQuestionInDto } from './dto/update-question.dto';

@ApiTags('question')
@Controller('question')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('frequently')
  @ApiResponseEntity({
    type: FrequentlyQuestionDto,
    summary: '내 질문',
  })
  async getFrequentlyQuestion(): Promise<ResponseEntity<FrequentlyQuestion[]>> {
    const frequentlyQuestions =
      await this.questionService.getFrequentlyQuestion();

    return ResponseEntity.ok().body(frequentlyQuestions);
  }

  @Get()
  @ApiResponseEntity({
    type: QuestionDto,
    summary: '내 질문',
  })
  async getQuestion(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<Question[]>> {
    const questions = await this.questionService.getQuestion(user.id);

    return ResponseEntity.ok().body(questions);
  }

  @Post('create')
  @ApiResponseEntity({
    type: QuestionDto,
    summary: '질문 생성',
  })
  @UserLevelLock()
  async createQuestion(
    @CurrentUser() user: User,
    @Body() createQuestionInDto: CreateQuestionInDto,
  ): Promise<ResponseEntity<Question>> {
    const questionDto = await this.questionService.createQuestion(
      user,
      createQuestionInDto,
    );

    return ResponseEntity.ok().body(questionDto);
  }

  @Put('update/:id')
  @ApiResponseEntity({
    type: QuestionDto,
    summary: '질문 수정',
  })
  @UserLevelLock()
  async updateQuestion(
    @CurrentUser() user: User,
    @Body() updateQuestionInDto: UpdateQuestionInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<Question>> {
    const updateGroupOutDto = await this.questionService.updateQuestion(
      user,
      Number(id),
      updateQuestionInDto,
    );

    return ResponseEntity.ok().body(updateGroupOutDto);
  }

  @Delete('delete/:id')
  @ApiResponseEntity({
    summary: '질문 삭제',
  })
  @UserLevelLock()
  async deleteQuestion(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.questionService.deleteQuestion(user, Number(id));

    return ResponseEntity.ok().build();
  }
}

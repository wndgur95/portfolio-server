import { Inject, Injectable } from '@nestjs/common';
import { WeddingMessagesRepository } from '@libs/dao/wedding/wedding-messages/interfaces/wedding-messages-repository.interface';
import { GetWeddingMessageInDto } from './dto/get-wedding-messages/get-wedding-message-in.dto';
import { PageMetaDto } from '@libs/common/pagination/dto/page-meta.dto';
import { WeddingMessageOutDto } from './dto/get-wedding-messages/get-wedding-message-out.dto';
import { WeddingMessageEntity } from '@libs/dao/wedding/wedding-messages/entities/wedding-message.entity';
import { CreateWeddingMessageInDto } from './dto/create-wedding-message/create-wedding-message-in.dto';
import { ValidateProvider } from '@libs/common/provider/validate.provider';
import { DeleteWeddingMessageInDto } from './dto/delete-wedding-message/delete-wedding-message-in.dto';
import { RoulettesRepository } from '@libs/dao/wedding/roulettes/interfaces/roulettes-repository.interface';
import { MakeRouletteInDto } from './dto/make-roulette/make-roulette-in.dto';
import { RouletteEntity } from '@libs/dao/wedding/roulettes/entities/roulette.entity';
import { RouletteDto } from '@libs/dao/wedding/roulettes/dto/roulette.dto';
import crypto from 'crypto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class WeddingService {
  constructor(
    @Inject(WeddingMessagesRepository)
    private readonly weddingMessagesRepository: WeddingMessagesRepository,
    @Inject(RoulettesRepository)
    private readonly roulettesRepository: RoulettesRepository,
    private readonly validateProvider: ValidateProvider,
  ) {}

  async getWeddingMessage(
    getWeddingMessageInDto: GetWeddingMessageInDto,
  ): Promise<[WeddingMessageOutDto[], PageMetaDto]> {
    const { page, take } = getWeddingMessageInDto;
    const skip = (page - 1) * take;

    const [weddingMessages, itemCount] =
      await this.weddingMessagesRepository.findAllAndCount(take, skip, 'DESC');

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: getWeddingMessageInDto,
      itemCount,
    });
    return [
      weddingMessages.map((it) => {
        return WeddingMessageOutDto.of({
          id: it.id,
          name: it.name,
          context: it.context,
          createdAt: Number(it.createdAt),
        });
      }),
      pageMetaDto,
    ];
  }

  async createWeddingMessage(
    createWeddingMessageInDto: CreateWeddingMessageInDto,
  ): Promise<void> {
    const { name, context } = createWeddingMessageInDto;

    const isNonEmpty = (str: string): boolean => str.trim().length > 0;

    if (
      isNonEmpty(name) &&
      isNonEmpty(context) &&
      this.validateProvider.badWordsValidate(name) &&
      this.validateProvider.badWordsValidate(context)
    ) {
      await this.weddingMessagesRepository.save(
        WeddingMessageEntity.create({
          name: name,
          context: context,
        }),
        { reload: false },
      );
    }
  }

  async deleteWeddingMessage(
    deleteWeddingMessageInDto: DeleteWeddingMessageInDto,
  ): Promise<void> {
    const { id, command } = deleteWeddingMessageInDto;
    if (command == '횸뚜 사랑해' || command == '쭝뚜 사랑해') {
      await this.weddingMessagesRepository.softDelete(id);
    }
  }

  async getRoulette(): Promise<RouletteDto> {
    const roulette = await this.roulettesRepository.getLastRoulette();
    return RouletteDto.fromEntity(roulette);
  }

  async makeRoulette(makeRouletteInDto: MakeRouletteInDto): Promise<void> {
    const { password, bride, groom } = makeRouletteInDto;

    if (
      password != '중혁효민결혼식' &&
      password != 'wndgurgyalsrufghstlr' &&
      password != '효민중혁결혼식' &&
      password != 'gyalswndgurrufghstlr'
    ) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID);
    }

    const pool = [];
    for (let i = 0; i < bride; i++) {
      pool.push(`신부 ${i + 1}`);
    }

    for (let i = 0; i < groom; i++) {
      pool.push(`신랑 ${i + 1}`);
    }

    // Fisher-Yates 알고리즘으로 배열 섞기
    for (let i = pool.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[randomIndex]] = [pool[randomIndex], pool[i]];
    }

    const roulette = RouletteEntity.create({
      bride: bride,
      groom: groom,
      pool: JSON.stringify(pool),
      exception: JSON.stringify([]),
    });

    await this.roulettesRepository.save(roulette, { reload: false });
  }

  async randomRoulette(): Promise<number> {
    const roulette = await this.roulettesRepository.getLastRoulette();
    const pool = JSON.parse(roulette.pool);
    const exception = JSON.parse(roulette.exception);
    const index = crypto.randomInt(0, pool.length - 1);

    const removedItem = pool.splice(index, 1)[0];
    roulette.pool = JSON.stringify(pool);
    exception.push(removedItem);
    roulette.exception = JSON.stringify(exception);
    await this.roulettesRepository.save(roulette, { reload: false });

    return index;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { calculateSajuSimple } from '@fullstackfamily/manseryeok';
import { AnalyzeSajuInDto, SajuCategory } from './dto/analyze-saju.dto';
import { SajuResultDbRepository } from '@libs/dao/saju/repositories/saju-result-db.repository';
import { SajuResultEntity } from '@libs/dao/saju/entities/saju-result.entity';
import {
  CHEONGAN_MAP,
  JIJI_MAP,
  SEASON_NAME_MAP,
  HOUR_STRING_MAP,
} from './catalog/saju-core.constants';
import { FRUIT_CATALOG, FRUIT_MOOD_PREFIXES, FRUIT_SEASON_PREFIXES, SajuItemBase } from './catalog/fruit.catalog';
import { DESSERT_CATALOG, DESSERT_MOOD_PREFIXES, DESSERT_SEASON_PREFIXES } from './catalog/dessert.catalog';
import { DRINK_CATALOG, DRINK_MOOD_PREFIXES, DRINK_SEASON_PREFIXES } from './catalog/drink.catalog';
import { randomBytes } from 'crypto';

@Injectable()
export class SajuService {
  constructor(private readonly sajuRepository: SajuResultDbRepository) {}

  async analyzeAndSave(dto: AnalyzeSajuInDto) {
    const { category, name, year, month, day, hourIndex, gender } = dto;

    const hourMap = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
    const solarHour = hourIndex >= 0 && hourIndex < 12 ? hourMap[hourIndex] : undefined;

    // 1. 만세력 연산
    const saju = calculateSajuSimple(year, month, day, solarHour);

    const elementsCount: Record<'목' | '화' | '토' | '금' | '수', number> = {
      목: 0,
      화: 0,
      토: 0,
      금: 0,
      수: 0,
    };

    const yearGan = saju.yearPillar[0];
    const yearJi = saju.yearPillar[1];
    const monthGan = saju.monthPillar[0];
    const monthJi = saju.monthPillar[1];
    const dayGan = saju.dayPillar[0];
    const dayJi = saju.dayPillar[1];

    const countGan = (g: string) => {
      if (CHEONGAN_MAP[g]) elementsCount[CHEONGAN_MAP[g].element]++;
    };
    const countJi = (j: string) => {
      if (JIJI_MAP[j]) elementsCount[JIJI_MAP[j].element]++;
    };

    countGan(yearGan);
    countJi(yearJi);
    countGan(monthGan);
    countJi(monthJi);
    countGan(dayGan);
    countJi(dayJi);

    let hourGan = '';
    let hourJi = '';
    if (saju.hourPillar) {
      hourGan = saju.hourPillar[0];
      hourJi = saju.hourPillar[1];
      countGan(hourGan);
      countJi(hourJi);
    }

    // 2. 일간 및 계절 도출
    const dayMaster = CHEONGAN_MAP[dayGan] || { element: '목' as const, name: '갑목' };
    const season = JIJI_MAP[monthJi]?.season || 'spring';
    const seasonName = SEASON_NAME_MAP[season];

    // 3. 최강 오행 산출
    let maxElCount = -1;
    let dominantElement: '목' | '화' | '토' | '금' | '수' = dayMaster.element;
    (['목', '화', '토', '금', '수'] as const).forEach((el) => {
      if (elementsCount[el] > maxElCount) {
        maxElCount = elementsCount[el];
        dominantElement = el;
      }
    });

    // 4. 이름 해시 및 테마 카탈로그 선택
    let nameHash = 0;
    for (let i = 0; i < name.length; i++) {
      nameHash += name.charCodeAt(i);
    }

    let catalog: SajuItemBase[];
    let seasonPrefixes: Record<string, string[]>;
    let moodPrefixes: Record<string, string[]>;

    if (category === SajuCategory.FRUIT) {
      catalog = FRUIT_CATALOG;
      seasonPrefixes = FRUIT_SEASON_PREFIXES;
      moodPrefixes = FRUIT_MOOD_PREFIXES;
    } else if (category === SajuCategory.DESSERT) {
      catalog = DESSERT_CATALOG;
      seasonPrefixes = DESSERT_SEASON_PREFIXES;
      moodPrefixes = DESSERT_MOOD_PREFIXES;
    } else {
      catalog = DRINK_CATALOG;
      seasonPrefixes = DRINK_SEASON_PREFIXES;
      moodPrefixes = DRINK_MOOD_PREFIXES;
    }

    const sList = seasonPrefixes[season];
    const seasonPrefix = sList[Math.abs(year + month + nameHash) % sList.length];

    const mList = moodPrefixes[dominantElement];
    const moodPrefix = mList[Math.abs(day + (hourIndex >= 0 ? hourIndex : 7) + nameHash) % mList.length];

    const baseIndex =
      Math.abs(nameHash + year * 3 + month * 7 + day * 11 + (hourIndex >= 0 ? hourIndex * 13 : 5)) %
      catalog.length;
    const baseItem = catalog[baseIndex];

    const finalTitle = `${seasonPrefix} ${moodPrefix} ${baseItem.name}`;
    const sajuDetail = `당신은 ${seasonName}에 태어났으며, 나를 상징하는 본원(일간)은 '${dayMaster.name}'입니다. 사주 전반에 걸쳐 ${dominantElement}(${dominantElement === '목' ? '나무' : dominantElement === '화' ? '불' : dominantElement === '토' ? '흙' : dominantElement === '금' ? '쇠' : '물'})의 기운이 가장 왕성하여, ${baseItem.name}처럼 특별한 개성과 매력을 지닌 인생 명식을 완성하고 있습니다.`;

    const hourString =
      hourIndex >= 0 && hourIndex < 12 ? HOUR_STRING_MAP[hourIndex] : '시간 미입력';

    const fullResult = {
      name,
      category,
      solarDateString: `${year}년 ${month}월 ${day}일`,
      gender: gender === 'female' ? '여성' : '남성',
      hourString,
      pillars: {
        year: {
          hangul: saju.yearPillar,
          hanja: saju.yearPillarHanja,
          ganEl: CHEONGAN_MAP[yearGan]?.element || '목',
          jiEl: JIJI_MAP[yearJi]?.element || '토',
        },
        month: {
          hangul: saju.monthPillar,
          hanja: saju.monthPillarHanja,
          ganEl: CHEONGAN_MAP[monthGan]?.element || '화',
          jiEl: JIJI_MAP[monthJi]?.element || '화',
        },
        day: {
          hangul: saju.dayPillar,
          hanja: saju.dayPillarHanja,
          ganEl: CHEONGAN_MAP[dayGan]?.element || '금',
          jiEl: JIJI_MAP[dayJi]?.element || '금',
        },
        hour: saju.hourPillar
          ? {
              hangul: saju.hourPillar,
              hanja: saju.hourPillarHanja || '',
              ganEl: CHEONGAN_MAP[hourGan]?.element || '수',
              jiEl: JIJI_MAP[hourJi]?.element || '수',
            }
          : undefined,
      },
      dayMaster: {
        char: dayGan,
        name: dayMaster.name,
        element: dayMaster.element,
        desc: `사주명리학에서 나 자신을 상징하는 글자는 '${dayMaster.name}'입니다.`,
      },
      elementsCount,
      dominantElement,
      season,
      seasonName,
      item: {
        id: baseItem.id,
        name: baseItem.name,
        title: finalTitle,
        emoji: baseItem.emoji,
        element: baseItem.element,
        elementName: baseItem.elementName,
        gradient: baseItem.gradient,
        tags: [
          `#${season === 'spring' ? '봄날의온기' : season === 'summer' ? '여름의열정' : season === 'autumn' ? '가을결실' : '겨울눈꽃'}`,
          `#${dominantElement}기운폭발`,
          ...baseItem.defaultTags.slice(0, 3),
        ],
        personality: baseItem.basePersonality,
        sajuDetail,
        advice: baseItem.baseAdvice,
        luckyColor: baseItem.luckyColor,
        luckyPairing: baseItem.luckyPairing,
        luckyItem: baseItem.luckyItem,
        bestMatch: baseItem.bestPartner,
        worstMatch: baseItem.worstPartner,
      },
    };

    // 5. saju_db에 결과 저장 (공유 키 생성)
    const shareKey = randomBytes(8).toString('hex'); // 16자리 hex

    const record = new SajuResultEntity();
    record.shareKey = shareKey;
    record.category = category;
    record.userName = name;
    record.solarYear = year;
    record.solarMonth = month;
    record.solarDay = day;
    record.hourIndex = hourIndex;
    record.gender = gender;
    record.dominantElement = dominantElement;
    record.resultTitle = finalTitle;
    record.resultEmoji = baseItem.emoji;
    record.resultData = fullResult;
    record.viewCount = 0;

    await this.sajuRepository.save(record);

    return {
      shareKey,
      ...fullResult,
    };
  }

  async getResultByShareKey(shareKey: string) {
    const record = await this.sajuRepository.findByShareKey(shareKey);
    if (!record) {
      throw new NotFoundException(`사주 결과를 찾을 수 없습니다: ${shareKey}`);
    }

    // 조회수 비동기 증가
    this.sajuRepository.incrementViewCount(shareKey).catch(() => null);

    return {
      shareKey: record.shareKey,
      viewCount: record.viewCount + 1,
      createdAt: record.createdAt,
      ...record.resultData,
    };
  }

  async getStats() {
    const totalCount = await this.sajuRepository.count();
    return {
      totalCount,
    };
  }
}

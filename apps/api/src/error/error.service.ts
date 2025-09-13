import { Injectable } from '@nestjs/common';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { randomUUID } from 'crypto';
import { RandomUtil } from '@libs/common/utils/random.util';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class ErrorService {
  internalError(): void {
    throw new ServerErrorException(
      RandomUtil.getRandomValue(Object.values(INTERNAL_ERROR_CODE)),
    );
  }

  unknownError(): void {
    throw new Error(`언논 에러 발생 ${randomUUID()}`);
  }

  async getLog(): Promise<string> {
    const baseFilename = `${process.env.HOSTNAME ?? 'local'}-error.log`;
    const dirname = 'logs/internal';
    
    // ContextProvider.getNow()를 사용해서 오늘 날짜 가져오기
    const now = ContextProvider.getNow();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    
    // 오늘 날짜가 포함된 파일명 생성 (예: local-error.log.2024-01-15)
    const filename = `${baseFilename}.${today}`;
    const filePath = join(process.cwd(), dirname, filename);

    try {
      // 파일이 존재하는지 확인
      if (!existsSync(filePath)) {
        return '로그 파일이 존재하지 않습니다.';
      }

      // 파일 내용 읽기
      const fileContent = readFileSync(filePath, 'utf-8');
      const lines = fileContent.trim().split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        return '로그 파일이 비어있습니다.';
      }

      // 마지막 줄 가져오기
      const lastLine = lines[lines.length - 1];
      
      // JSON 파싱 시도
      let parsedLog;
      try {
        parsedLog = JSON.parse(lastLine);
      } catch {
        // JSON이 아닌 경우 원본 텍스트 반환
        parsedLog = lastLine;
      }

      return parsedLog;
    } catch (error) {
      return '로그 파일 읽기 실패';
    }
  }
}

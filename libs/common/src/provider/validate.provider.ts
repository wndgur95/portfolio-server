import { Injectable } from '@nestjs/common';
import { BAD_WORDS } from '@libs/common/constants/bad-words.constants';

@Injectable()
export class ValidateProvider {
  private badWords: any;

  downLoadBadWords(): any {
    this.badWords = Object.values(BAD_WORDS).flat(1);
  }

  // filter
  badWordsValidate(words: string): boolean {
    if (!this.badWords) this.downLoadBadWords();

    return (
      this.badWords.filter((it: string) => words.includes(it)).length === 0
    );
  }

  checkBadWords(words: string): string[] {
    if (!this.badWords) this.downLoadBadWords();

    return this.badWords.filter((it: string) => words.includes(it));
  }
}

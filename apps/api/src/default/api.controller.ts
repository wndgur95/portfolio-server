import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { join } from 'path';
import { Response } from 'express';
import { marked } from 'marked';
import { readFileSync } from 'fs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.apiService.health());
  }

  @Get('/privacy-policy')
  getPrivacyPolicy(@Res() res: Response): void {
    const markdownPath = join(__dirname, '..', 'public', 'privacy_policy.md');

    try {
      const markdownContent = readFileSync(markdownPath, 'utf-8');
      const htmlContent = marked(markdownContent);

      const htmlWrapper = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>개인정보처리방침</title>
          <style>
            body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
            h1, h2, h3 { color: #222; }
            ul { padding-left: 20px; }
            strong { font-weight: bold; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(htmlWrapper);
    } catch (error) {
      res.status(500).send('개인정보처리방침을 불러오지 못했습니다.');
    }
  }

  @Get('/privacy-policy-md')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  getPrivacyPolicyMd(@Res() res: Response): void {
    const filePath = join(__dirname, '..', 'public', 'privacy_policy.md');

    try {
      const markdown = readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/markdown');
      res.send(markdown);
    } catch (error) {
      res.status(500).send('개인정보처리방침을 불러오지 못했습니다.');
    }
  }
}

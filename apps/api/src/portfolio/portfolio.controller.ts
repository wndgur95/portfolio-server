import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { ContactDto } from './dto/contact.dto';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('profile')
  @ApiOperation({ summary: '개발자 프로필 정보 조회' })
  @ApiResponse({ status: 200, description: '프로필 정보 반환' })
  async getProfile() {
    return this.portfolioService.getProfile();
  }

  @Get('skills')
  @ApiOperation({ summary: '기술 스택 목록 조회' })
  @ApiResponse({ status: 200, description: '기술 스택 목록 반환' })
  async getSkills() {
    return this.portfolioService.getSkills();
  }

  @Get('projects')
  @ApiOperation({ summary: '프로젝트 목록 조회' })
  @ApiResponse({ status: 200, description: '프로젝트 목록 반환' })
  async getProjects() {
    return this.portfolioService.getProjects();
  }

  @Get('projects/:id')
  @ApiOperation({ summary: '특정 프로젝트 상세 정보 조회' })
  @ApiResponse({ status: 200, description: '프로젝트 상세 정보 반환' })
  async getProject(@Param('id') id: string) {
    return this.portfolioService.getProject(id);
  }

  @Get('blog')
  @ApiOperation({ summary: '블로그 포스트 목록 조회' })
  @ApiResponse({ status: 200, description: '블로그 포스트 목록 반환' })
  async getBlogPosts(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.portfolioService.getBlogPosts(page, limit);
  }

  @Get('blog/:id')
  @ApiOperation({ summary: '특정 블로그 포스트 조회' })
  @ApiResponse({ status: 200, description: '블로그 포스트 내용 반환' })
  async getBlogPost(@Param('id') id: string) {
    return this.portfolioService.getBlogPost(id);
  }

  @Post('contact')
  @ApiOperation({ summary: '연락처 메시지 전송' })
  @ApiResponse({ status: 201, description: '메시지 전송 성공' })
  async sendContact(@Body() contactDto: ContactDto) {
    return this.portfolioService.sendContact(contactDto);
  }

  @Get('stats')
  @ApiOperation({ summary: '포트폴리오 통계 정보 조회' })
  @ApiResponse({ status: 200, description: '통계 정보 반환' })
  async getStats() {
    return this.portfolioService.getStats();
  }
} 
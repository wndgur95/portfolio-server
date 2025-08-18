import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class PortfolioService {
  async getProfile() {
    return {
      name: '이중혁',
      title: 'NestJS 백엔드 개발자',
      email: 'your.email@example.com',
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      description: '3년 이상의 백엔드 개발 경험을 가진 NestJS 전문가입니다. 마이크로서비스 아키텍처, 데이터베이스 설계, API 개발에 특화되어 있으며, 안정적이고 확장 가능한 서버 시스템을 구축하는 것을 즐깁니다.',
      experience: '3+ years',
      location: 'Seoul, South Korea',
      avatar: '/avatar.jpg'
    };
  }

  async getSkills() {
    return [
      { name: 'NestJS', level: 90, color: 'bg-red-500', category: 'Backend' },
      { name: 'TypeScript', level: 85, color: 'bg-blue-500', category: 'Language' },
      { name: 'Node.js', level: 88, color: 'bg-green-500', category: 'Backend' },
      { name: 'PostgreSQL', level: 80, color: 'bg-purple-500', category: 'Database' },
      { name: 'MySQL', level: 75, color: 'bg-orange-500', category: 'Database' },
      { name: 'Redis', level: 70, color: 'bg-red-600', category: 'Cache' },
      { name: 'Docker', level: 75, color: 'bg-blue-600', category: 'DevOps' },
      { name: 'AWS', level: 70, color: 'bg-orange-600', category: 'Cloud' },
      { name: 'React', level: 65, color: 'bg-blue-400', category: 'Frontend' },
      { name: 'Next.js', level: 60, color: 'bg-black', category: 'Frontend' }
    ];
  }

  async getProjects() {
    return [
      {
        id: '1',
        title: 'Wedding Management System',
        description: '풀스택 웨딩 관리 시스템 - NestJS, Next.js, PostgreSQL',
        tech: ['NestJS', 'Next.js', 'PostgreSQL', 'Docker'],
        image: '/project1.jpg',
        github: 'https://github.com/yourusername/wedding-system',
        demo: 'https://wedding-demo.example.com',
        features: ['사용자 관리', '예약 시스템', '결제 연동', '관리자 대시보드'],
        category: 'Full Stack'
      },
      {
        id: '2',
        title: 'Game Server API',
        description: '게임 서버 백엔드 API - 마이크로서비스 아키텍처',
        tech: ['NestJS', 'Redis', 'MySQL', 'TypeScript'],
        image: '/project2.jpg',
        github: 'https://github.com/yourusername/game-server',
        demo: 'https://game-api.example.com',
        features: ['실시간 게임 로직', '사용자 인증', '데이터 동기화', '성능 최적화'],
        category: 'Backend'
      },
      {
        id: '3',
        title: 'Data Management Tool',
        description: '데이터 관리 및 분석 도구',
        tech: ['NestJS', 'React', 'PostgreSQL', 'Chart.js'],
        image: '/project3.jpg',
        github: 'https://github.com/yourusername/data-tool',
        demo: 'https://data-tool.example.com',
        features: ['데이터 시각화', '실시간 분석', '보고서 생성', 'API 연동'],
        category: 'Data'
      }
    ];
  }

  async getProject(id: string) {
    const projects = await this.getProjects();
    return projects.find(project => project.id === id) || null;
  }

  async getBlogPosts(page: number = 1, limit: number = 10) {
    const posts = [
      {
        id: '1',
        title: 'NestJS 마이크로서비스 아키텍처 구축하기',
        excerpt: 'NestJS를 사용한 마이크로서비스 아키텍처 설계와 구현 방법에 대해 알아봅니다.',
        content: '마이크로서비스 아키텍처는...',
        author: '이중혁',
        publishedAt: '2024-08-13',
        tags: ['NestJS', 'Microservices', 'Architecture'],
        readTime: '5 min'
      },
      {
        id: '2',
        title: 'TypeScript와 NestJS로 안전한 API 개발하기',
        excerpt: 'TypeScript의 타입 시스템을 활용한 안전한 API 개발 방법을 소개합니다.',
        content: 'TypeScript는...',
        author: '이중혁',
        publishedAt: '2024-08-10',
        tags: ['TypeScript', 'NestJS', 'API'],
        readTime: '7 min'
      },
      {
        id: '3',
        title: 'PostgreSQL 성능 최적화 팁',
        excerpt: 'PostgreSQL 데이터베이스의 성능을 최적화하는 다양한 방법들을 알아봅니다.',
        content: '데이터베이스 성능 최적화는...',
        author: '이중혁',
        publishedAt: '2024-08-07',
        tags: ['PostgreSQL', 'Database', 'Performance'],
        readTime: '10 min'
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: posts.length,
        totalPages: Math.ceil(posts.length / limit)
      }
    };
  }

  async getBlogPost(id: string) {
    const posts = await this.getBlogPosts();
    return posts.posts.find(post => post.id === id) || null;
  }

  async sendContact(contactDto: ContactDto) {
    // 실제 구현에서는 이메일 서비스나 데이터베이스에 저장
    console.log('Contact message received:', contactDto);
    
    return {
      success: true,
      message: '메시지가 성공적으로 전송되었습니다.',
      timestamp: new Date().toISOString()
    };
  }

  async getStats() {
    return {
      projects: 15,
      experience: '3+ years',
      technologies: 12,
      clients: 8,
      githubStars: 45,
      blogPosts: 25
    };
  }
} 
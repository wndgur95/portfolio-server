# Portfolio Server

## 📋 프로젝트 개요

Portfolio Server는 NestJS 기반의 마이크로서비스 아키텍처를 채택한 대규모 게임/웹 백엔드 서버입니다. 블록체인 게임 플랫폼의 핵심 기능인 NFT 관리, 가챠 시스템, 아레나 배틀, 실시간 소켓 통신, 배치 처리 등을 제공합니다.

**주요 특징:**
- **마이크로서비스 아키텍처**: admin, api, game, batch, job, log, socket 서비스로 분리
- **멀티 데이터베이스**: MySQL(게임 데이터), MongoDB(로그), Redis(캐싱/세션)
- **블록체인 연동**: Web3.js, Ethers.js를 통한 스마트 컨트랙트 상호작용
- **실시간 통신**: Socket.io 기반 실시간 채팅 및 배틀 시스템
- **배치 처리**: Kafka를 활용한 대용량 데이터 처리 및 이벤트 로그 수집
- **인증/인가**: JWT, OAuth, Firebase Admin SDK를 통한 다중 인증 시스템

## 🚀 빠른 시작 (Quick Start)

### 1. 프로젝트 클론
```bash
git clone https://github.com/wndgur95/portfolio-server.git
cd portfolio-server
```

### 2. Docker Compose 실행
```bash
# Docker Compose를 사용하여 MySQL 및 기타 서비스 시작
docker-compose up -d

# 컨테이너 상태 확인
docker-compose ps
```

### 3. 의존성 설치
```bash
# pnpm으로 의존성 설치
pnpm install
```

### 4. 환경 변수 설정
```bash
# 환경 변수 파일 복사
cp config/.app.empty.env config/.app.test.env
```

### 5. 개발 서버 시작
```bash
# NestJS 개발 서버 시작
pnpm start:dev
```

### 6. 서비스 확인
- **NestJS 서버**: http://localhost:3000
- **MySQL 데이터베이스**: localhost:3306
  - **데이터베이스**: `arena`, `common`, `game00`, `game01`, `contract`, `batch`

## 🏗️ 프로젝트 구조

```
portfolio-server/
├── apps/                         # 마이크로서비스 애플리케이션들
│   ├── admin/                    # 관리자 서비스
│   │   ├── arena/                # 아레나 관리
│   │   ├── auth/                 # 인증/인가
│   │   ├── character/            # 캐릭터 관리
│   │   ├── mission/              # 미션 관리
│   │   ├── token/                # 토큰 관리
│   │   └── user/                 # 사용자 관리
│   ├── api/                      # API 서비스
│   │   ├── airdrop/              # 에어드랩
│   │   ├── auth/                 # 인증/인가
│   │   ├── contract/             # 컨트랙트 연동
│   │   ├── nft/                  # NFT 관리
│   │   ├── token/                # 토큰 관리
│   │   ├── user/                 # 사용자 관리
│   │   └── web3/                 # Web3 연동
│   ├── batch/                    # 배치 처리 서비스
│   │   ├── airdrop/              # 에어드랩 배치
│   │   ├── erc1155/              # ERC1155 배치
│   │   ├── erc721/                # ERC721 배치
│   │   ├── import-log/            # 로그 임포트
│   │   ├── message/               # 메시지 처리
│   │   └── message-kafka/         # Kafka 메시지
│   ├── game/                     # 게임 서비스
│   │   ├── auth/                 # 게임 인증
│   │   ├── battle/               # 전투 시스템
│   │   ├── character/            # 캐릭터 시스템
│   │   ├── mission/              # 미션 시스템
│   │   └── shop/                 # 상점 시스템
│   ├── job/                      # 작업 스케줄러
│   │   ├── portfolio/            # 포트폴리오 작업
│   │   └── process/              # 프로세스 관리
│   ├── log/                      # 로그 서비스
│   │   └── mongo-log/            # MongoDB 로그
│   └── socket/                   # 소켓 서비스
│       ├── chatting/             # 채팅
│       ├── kafka/                # Kafka 연동
│       └── solo-battle/          # 솔로 배틀
├── libs/                         # 공통 라이브러리
│   ├── common/                   # 공통 유틸리티
│   │   ├── constants/            # 상수
│   │   ├── databases/            # 데이터베이스
│   │   ├── decorator/            # 데코레이터
│   │   ├── dto/                  # DTO
│   │   ├── interceptor/          # 인터셉터
│   │   ├── provider/             # 프로바이더
│   │   └── utils/                # 유틸리티
│   └── dao/                      # 데이터 액세스 객체
│       ├── arena/                # 아레나 DAO
│       ├── batch/                # 배치 DAO
│       ├── common/               # 공통 DAO
│       ├── contract/             # 컨트랙트 DAO
│       ├── game/                 # 게임 DAO
│       ├── mongo/                # MongoDB DAO
│       ├── redis/                # Redis DAO
│       └── static/               # 정적 데이터 DAO
├── initdb.d/                     # MySQL 초기화 스크립트
├── docker-compose.yml            # Docker Compose 설정
├── package.json                  # 의존성 및 스크립트
└── README.md                     # 프로젝트 문서
```

## 🛠️ 기술 스택

- **Backend**: NestJS, TypeScript, Node.js
- **Database**: MySQL
- **Infrastructure**: Docker, Docker Compose
- **Development**: pnpm

## 📝 주요 기능

- **아레나 시스템**: 게임 내 아레나 기능 관리
- **게임 데이터 관리**: game00, game01 데이터베이스 관리
- **공통 서비스**: 공통 기능 및 유틸리티
- **컨트랙트 연동**: 스마트 컨트랙트와의 연동
- **배치 처리**: 대용량 데이터 처리 시스템

## 🔧 개발 명령어

```bash
# 개발 서버 시작
pnpm start:dev

# 프로덕션 빌드
pnpm run build

# 프로덕션 실행
pnpm run start:prod

# 테스트 실행
pnpm test

# E2E 테스트
pnpm run test:e2e
```

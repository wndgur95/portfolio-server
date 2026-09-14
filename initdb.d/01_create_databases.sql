-- Portfolio Server Database 초기화 스크립트

-- arena 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS `arena` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- common 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS `common` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- game00 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS `game00` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- game01 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS `game01` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- contract 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS `contract` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- batch 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS `batch` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- saju_db 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS `saju_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- portfolio_server 사용자 생성
CREATE USER 'portfolio_server'@'%' IDENTIFIED BY 'portfolio_server!23';

-- portfolio_server 사용자에게 모든 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'portfolio_server'@'%';

-- 권한 새로고침
FLUSH PRIVILEGES;

-- 데이터베이스 생성 확인
SHOW DATABASES;

-- 사용자 생성 확인
SELECT User, Host FROM mysql.user WHERE User = 'portfolio_server';

-- 초기화 완료 로그
SELECT 'Database initialization completed: arena, common, game00, game01, contract, batch databases created' as status;

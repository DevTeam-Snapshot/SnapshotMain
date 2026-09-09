# React 개발 환경 전용 Dockerfile
# - Nginx를 사용하지 않고, Node.js 개발 서버(Vite / CRA)를 직접 띄워 실시간 반영(Hot Reload)을 지원합니다.

# 1. Base Image: Node.js 20 (경량화 alpine 버전)
FROM node:20-alpine

# 2. 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일 복사 및 의존성 라이브러리 설치 (캐싱 활용)
COPY package*.json ./
RUN npm install

# 4. 소스 코드 전체 복사
COPY . .

# 5. React 개발 서버 포트 노출 (Vite 기본 포트: 5173 / Create-React-App은 3000)
# 프로젝트에 맞는 포트로 사용하세요. (Vite 사용 기준 5173)
EXPOSE 5173

# 6. 외부(호스트) 접속 허용을 위한 --host 옵션과 함께 개발 서버 실행
CMD ["npm", "run", "dev"]

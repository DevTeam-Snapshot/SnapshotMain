# React-Frontend

질문과 DB index를 Backend에 전달하고, PostgreSQL 조회값과 vLLM 생성 답변을 표시하는 React 화면입니다.

## 연동 구조

```text
Browser
  → Frontend
  → Backend POST /api/integration-test
      ├→ PostgreSQL
      └→ vLLM
```

Frontend는 PostgreSQL이나 vLLM에 직접 접속하지 않습니다. 두 서비스와의 통신은 Backend가 담당합니다.

## 주요 기능

- 질문 및 DB index 입력
- Backend `POST /api/integration-test` 호출
- PostgreSQL에서 조회한 `db_text` 표시
- vLLM이 생성한 `model_answer` 표시
- Backend 오류 메시지 표시
- 요청 60초 timeout 적용

## 실행 환경

- Node.js
- npm
- React
- Vite

## 로컬 개발 실행(단독 서버 실행)

환경 변수 파일을 준비합니다.

```bash
cp .env.example .env
```

기본 Backend 주소는 `http://localhost:9000`입니다. 다른 주소를 사용하면 `.env`를 수정합니다.

```env
VITE_API_BASE_URL=http://localhost:9000
```

의존성을 설치하고 개발 서버를 실행합니다.

```bash
npm install
npm run dev -- --port 3000
```

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:3000
```

Backend는 Frontend를 실행하기 전에 준비하는 것이 좋습니다. Backend의 CORS 설정에는 `http://localhost:3000`이 허용되어야 합니다.

## Docker 실행 : 단독 서버 실행시 권장되는 방식

- Linux VM
docker compose -f docker-compose.yml -f docker-compose.standalone.yml up -d --force-recreate

- Windows/Mac Docker Desktop
docker compose -f docker-compose.yml -f docker-compose.desktop.yml up -d --force-recreate

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

## 로컬 개발 실행

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
npm run dev
```

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:3000
```

Backend는 Frontend를 실행하기 전에 준비하는 것이 좋습니다. Backend의 CORS 설정에는 `http://localhost:3000`이 허용되어야 합니다.

## Docker 실행

`.env`에 브라우저에서 접속할 수 있는 Backend 주소를 지정한 뒤 Frontend 이미지를 빌드합니다.

```bash
docker build -t react-frontend:test .
docker run --rm -p 3000:80 react-frontend:test
```

브라우저 접속 주소:

```text
http://localhost:3000
```

`VITE_API_BASE_URL`은 Vite가 Frontend를 빌드할 때 JavaScript에 반영됩니다. 값을 바꾸면 컨테이너만 재시작하지 말고 Frontend 이미지를 다시 빌드해야 합니다.

GPU VM에서 Backend를 `9000` 포트로 공개한다면 예를 들어 다음과 같이 설정합니다.

```env
VITE_API_BASE_URL=http://VM_EXTERNAL_IP:9000
```

이 주소는 Frontend 컨테이너가 아니라 사용자의 브라우저가 호출하므로, Docker Compose 서비스명인 `http://backend:9000`을 지정하면 안 됩니다.

## API 계약

요청:

```http
POST /api/integration-test
Content-Type: application/json
```

```json
{
  "question": "서울 호텔 광고 문구를 작성해 줘.",
  "index": 1
}
```

응답:

```json
{
  "index": 1,
  "db_text": "PostgreSQL에서 조회한 텍스트",
  "model_answer": "vLLM이 생성한 답변"
}
```

`index`는 1 이상의 정수이며, 해당 ID의 데이터가 PostgreSQL에 존재해야 합니다.

## 연동 확인

전체 연동은 Frontend 화면에서 질문과 DB index를 전송한 뒤 다음을 확인합니다.

- `db_text`가 실제 PostgreSQL 데이터와 일치하는지
- `model_answer`가 모의 문구가 아닌 실제 vLLM 생성 결과인지
- 브라우저 개발자 도구에 CORS 또는 네트워크 오류가 없는지

## 주요 파일

| 파일 | 역할 |
| --- | --- |
| `src/main.jsx` | React 앱 시작점 |
| `src/App.jsx` | 질문/index 입력 및 응답 표시 |
| `src/api.js` | Backend API 호출과 오류 처리 |
| `src/styles.css` | 화면 스타일 |
| `.env.example` | Backend API 주소 예시 |
| `Dockerfile` | React 빌드 및 Nginx 이미지 생성 |
| `nginx.conf` | Nginx 정적 파일과 SPA 라우팅 설정 |

## 현재 제한사항

- Frontend는 Backend가 제공하는 API 계약만 검증합니다.
- PostgreSQL 연결, vLLM 호출과 오류 변환은 Backend에서 검증해야 합니다.
- vLLM의 초기 로딩이나 생성이 60초를 넘으면 Frontend 요청이 timeout 처리됩니다.

# MyLink

MyLink는 블로그, SNS, 포트폴리오 등 다양한 채널의 링크를 하나의 페이지로 모아 공유할 수 있는 **미니멀리스트 프로필 링크 서비스**입니다. 복잡한 설정 없이 직관적이고 빠른 프로필 관리를 제공합니다.

## ✨ 주요 기능

- 🎨 **미니멀리즘 디자인**: 불필요한 이미지 대신 텍스트와 자동 생성된 파비콘을 활용한 모던하고 깔끔한 UI를 제공합니다.
- ✏️ **인라인 에디팅 (Inline Editing)**: 별도의 수정 페이지 이동 없이, 화면에서 텍스트를 클릭하여 즉시 내용을 수정할 수 있는 직관적인 경험(WYSIWYG)을 제공합니다.
- 🚀 **제로 설정 온보딩 (Zero-Config)**: 구글 소셜 로그인을 통해 가입 즉시 고유한 URL(슬러그)이 자동 생성되어 바로 서비스를 이용할 수 있습니다.
- 🔗 **손쉬운 링크 관리**: 링크 추가 시 Google Favicon API를 통해 파비콘이 실시간으로 연동되며, 링크 제목과 URL도 인라인 에디팅으로 즉시 수정이 가능합니다. 원터치 링크 삭제도 지원합니다.

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Language**: TypeScript
- **Backend**: Firebase Authentication (Google 소셜 로그인 전용), Cloud Firestore
- **Assets**: Lucide-React, Google Favicon API

## 🚀 시작하기

프로젝트를 로컬 환경에서 실행하는 방법입니다.

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

루트 디렉토리에 `.env.local` 파일을 생성하고 다음 Firebase 관련 환경 변수를 추가해야 합니다.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

터미널에서 명령어를 실행한 후, 브라우저에서 `http://localhost:3000`으로 접속하여 서비스를 확인할 수 있습니다.

## 📁 주요 폴더 구조

```text
├── /app                # Next.js App Router (Pages & Layouts)
├── /components         # UI 컴포넌트 (shadcn/ui & 커스텀 컴포넌트)
├── /docs               # PRD, 유저 시나리오, 와이어프레임 등 문서
├── /hooks              # 커스텀 React Hooks
├── /lib                # 유틸리티 함수 및 설정 파일 (Firebase 설정 등)
└── /public             # 정적 리소스 (로고, 폰트 등)
```

## 📜 주요 명령어

- `npm run dev`: 개발 서버 실행 (Turbopack 활용)
- `npm run build`: 배포를 위한 프로덕션 빌드 생성
- `npm run start`: 프로덕션 빌드 파일로 서버 실행
- `npm run lint`: ESLint 코드 검사
- `npm run format`: Prettier 코드 포맷팅 (`**/*.{ts,tsx}`)
- `npm run typecheck`: TypeScript 타입 검사

## 🤝 개발 원칙

- **단순한 UI/UX**: `shadcn/ui`를 베이스로 하며, 다크/라이트 모드 전환 없이 하나의 고정 테마를 유지합니다. 모든 텍스트 편집 가능한 요소는 "Click-to-Edit"(인라인 에디팅) 방식을 따릅니다.
- **데이터 모델링**: 사용자 프로필은 Firestore의 문서로, 개별 링크는 해당 유저 문서의 하위 컬렉션(sub-collection)으로 관리합니다.
